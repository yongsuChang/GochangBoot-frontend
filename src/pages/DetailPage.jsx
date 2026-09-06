import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PrevNext from '../components/PrevNext';
import ReplyList from '../components/ReplyList';
import useContentDetail from '../hooks/useContentDetail';

const DETAIL_CSS = '/lib/css/page/content.css';

/** 옛 Thymeleaf content.html 을 그대로 옮긴 상세 페이지. */
function DetailPage() {
    const { id } = useParams();
    const { detail, replies, neighbors, status } = useContentDetail(id);

    // 상세 페이지 전용 CSS 는 이 페이지에 있을 때만 붙인다 (main.css 와 선택자가 겹친다)
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = DETAIL_CSS;
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <div className="wrapper">
            <Navbar />
            <div className="grid-container">
                <div id="writeRow_part" className="grid-contents">
                    <h2>후기 열람</h2>
                </div>
                <span id="list_part" className="grid-contents">
                    <Link to="/" style={{ float: 'right' }}>
                        <button type="button" id="ContentBoard" className="btn btn-sm">목록으로 돌아가기</button>
                    </Link>
                </span>

                {status === 'loading' && <p style={{ padding: '30px' }}>불러오는 중...</p>}
                {status === 'missing' && <p style={{ padding: '30px' }}>없는 게시물입니다. <Link to="/">목록으로</Link></p>}
                {status === 'error' && <p style={{ padding: '30px' }}>불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}

                {status === 'ok' && detail && (
                    <>
                        <div id="upperPrevNextPart">
                            <PrevNext prev={neighbors.prev} next={neighbors.next} />
                        </div>

                        <div id="contentDetailPart">
                            <div id="header_part" className="grid-contents">
                                <hr style={{ backgroundColor: 'rgb(248, 233, 27)' }} />
                                <h3>{detail.title}</h3>
                                <div>
                                    <div id="nickname">{detail.writer} &nbsp;&nbsp;{detail.write_date}</div>
                                    <span style={{ float: 'right', marginRight: '10px' }}>
                                        조회수:{detail.count} &nbsp;&nbsp; 추천수:{detail.recommend}
                                    </span>
                                </div>
                                <hr style={{ backgroundColor: 'rgb(248, 233, 27)' }} />
                            </div>
                            <div id="paragraph_part" className="grid-contents">
                                {/* 크롤링해 온 원본 HTML 을 그대로 보여준다 (이전 Vue 버전의 v-html 과 동일) */}
                                <div id="text_paragraph" style={{ marginLeft: 'auto', marginRight: 'auto' }}
                                     dangerouslySetInnerHTML={{ __html: detail.content }} />
                            </div>
                        </div>

                        <div id="lowerPrevNextPart">
                            <PrevNext prev={neighbors.prev} next={neighbors.next} />
                        </div>

                        <ReplyList replies={replies} />
                    </>
                )}
            </div>
        </div>
    );
}

export default DetailPage;
