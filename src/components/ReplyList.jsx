import React from 'react';

function ReplyList({ replies }) {
    return (
        <div id="reply_part">
            <h4 style={{ paddingLeft: '30px' }}>댓글 {replies.length}개</h4>
            <ul id="replyPart">
                {replies.map((reply) => (
                    <li key={reply.id} style={{ minHeight: '100px', border: '3px solid grey', marginBottom: '8px', padding: '8px' }}>
                        {reply.is_re_reply === '1' && (
                            <p style={{ fontSize: '18px', color: 'teal', fontWeight: 'bold' }}><b>[대댓글]</b></p>
                        )}
                        <p id="commentWriter">
                            작성자: {reply.writer}<br />
                            작성일: {reply.write_date}
                        </p>
                        {/* 크롤링해 온 원본 HTML 을 그대로 보여준다 (이전 Vue 버전의 v-html 과 동일) */}
                        <p id="commentText" dangerouslySetInnerHTML={{ __html: reply.content }} />
                        <hr style={{ backgroundColor: 'rgb(248, 233, 27)' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReplyList;
