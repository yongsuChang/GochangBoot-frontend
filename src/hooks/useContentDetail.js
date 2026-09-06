import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || '';
const REPLY_PAGE_SIZE = 100; // 백엔드의 페이지 크기 상한

const EMPTY = { id: null, status: 'loading', detail: null, replies: [], neighbors: { prev: null, next: null } };

async function fetchAllReplies(id) {
    const first = await axios.get(`${baseUrl}/api/replies/byContent/${id}`, {
        params: { page: 0, size: REPLY_PAGE_SIZE },
    });
    const list = [...first.data.data];
    const totalPages = first.data.pagination?.total_pages ?? 1;
    for (let page = 1; page < totalPages; page += 1) {
        const more = await axios.get(`${baseUrl}/api/replies/byContent/${id}`, {
            params: { page, size: REPLY_PAGE_SIZE },
        });
        list.push(...more.data.data);
    }
    return list;
}

/** 삭제된 글을 건너뛴 실제 앞뒤 글. { prev: {id,title}|null, next: {id,title}|null } */
async function fetchNeighbors(id) {
    const res = await axios.get(`${baseUrl}/api/contents/${id}/neighbors`);
    return res.data.data ?? { prev: null, next: null };
}

/** 글 본문, 댓글 전체, 앞뒤 글 링크를 한 번에 가져온다. status: loading | ok | missing | error */
function useContentDetail(id) {
    const numericId = Number(id);
    const [state, setState] = useState(EMPTY);

    useEffect(() => {
        let cancelled = false;
        window.scrollTo(0, 0);

        async function load() {
            try {
                const res = await axios.get(`${baseUrl}/api/contents/${numericId}`);
                if (cancelled) return;
                if (res.data.result_code !== 'OK' || !res.data.data) {
                    setState({ ...EMPTY, id: numericId, status: 'missing' });
                    return;
                }
                setState({ ...EMPTY, id: numericId, status: 'ok', detail: res.data.data });

                const [replies, neighbors] = await Promise.all([
                    fetchAllReplies(numericId),
                    fetchNeighbors(numericId),
                ]);
                if (cancelled) return;
                setState((prev) => ({ ...prev, replies, neighbors }));
            } catch (error) {
                console.error('Failed to fetch content detail:', error);
                if (!cancelled) setState({ ...EMPTY, id: numericId, status: 'error' });
            }
        }

        load();
        return () => { cancelled = true; };
    }, [numericId]);

    // 다른 글로 이동한 직후에는 이전 글 데이터를 보여주지 않고 로딩으로 취급한다
    return state.id === numericId ? state : EMPTY;
}

export default useContentDetail;
