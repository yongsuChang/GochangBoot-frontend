import { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || '';
const EMPTY_PAGINATION = { total_pages: 0, total_elements: 0, current_page: 0, current_elements: 0 };

/** 목록 조회. 조회 조건(query)이 바뀌면 다시 불러온다. */
function useBoardData() {
    const [query, setQuery] = useState({ page: 0, size: 15, type: '', word: '' });
    const [itemList, setItemList] = useState([]);
    const [pagination, setPagination] = useState(EMPTY_PAGINATION);

    useEffect(() => {
        let cancelled = false;
        const { page, size, type, word } = query;
        // params 로 넘기면 axios 가 검색어(& 나 # 포함)를 안전하게 인코딩한다
        const request = type && word
            ? { url: `${baseUrl}/api/contents/search`, params: { page, size, searchType: type, searchWord: word } }
            : { url: `${baseUrl}/api/contents`, params: { page, size } };

        axios.get(request.url, { params: request.params })
            .then((response) => {
                if (cancelled) return;
                setItemList(response.data.data ?? []);
                setPagination(response.data.pagination ?? EMPTY_PAGINATION);
            })
            .catch((error) => {
                console.error('Failed to fetch board data:', error);
            });

        return () => { cancelled = true; };
    }, [query]);

    const handlePageClick = (page) => setQuery((q) => ({ ...q, page }));
    const handleSearch = (type, word) => setQuery((q) => ({ ...q, page: 0, type, word }));
    const handleElementPerPageChange = (size) => setQuery((q) => ({ ...q, page: 0, size: Number(size) }));

    return {
        itemList,
        pagination,
        elementPerPage: query.size,
        handlePageClick,
        handleSearch,
        handleElementPerPageChange,
    };
}

export default useBoardData;
