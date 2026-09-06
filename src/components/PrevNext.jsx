import React from 'react';
import { Link } from 'react-router-dom';

/** 앞뒤 글 이동. 백엔드가 삭제된 글을 건너뛴 실제 이웃을 주며, 없으면(맨 끝) 비활성 표시. */
function PrevNext({ prev, next }) {
    return (
        <div className="prev_next_part">
            <div className="prev_page">
                {prev ? (
                    <Link to={`/contents/${prev.id}`}>
                        <p><b><em className="link">« Prev </em><span>{prev.title}</span></b></p>
                    </Link>
                ) : (
                    <p style={{ color: '#aaa' }}><b><em>« Prev </em>없음</b></p>
                )}
            </div>
            <div className="next_page">
                {next ? (
                    <Link to={`/contents/${next.id}`}>
                        <p><b><span>{next.title}</span><em className="link"> Next »</em></b></p>
                    </Link>
                ) : (
                    <p style={{ color: '#aaa' }}><b>없음<em> Next »</em></b></p>
                )}
            </div>
            <div style={{ clear: 'both' }} />
        </div>
    );
}

export default PrevNext;
