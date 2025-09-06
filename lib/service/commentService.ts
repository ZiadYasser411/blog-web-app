import { commentRepository } from "../repository/commentRepository";

export async function createComment(postId: string, content: string, commenterId: string) {
    if(!postId || !content || !commenterId) throw Object.assign(new Error("PostId, content, and commenterId are required"));
    return commentRepository.createComment(postId, content, commenterId);
}

export async function getCommentsByPostId(postId: string) {
    if(!postId) throw Object.assign(new Error("PostId is required"));
    return commentRepository.getCommentsByPostId(postId);
}

export async function editComment(id: string, commenterId: string, sessionId: string, content: string) {
    if(!id || !content) throw Object.assign(new Error("Id and content are required"));
    if(sessionId !== commenterId) throw Object.assign(new Error("Unauthorized"), { status: 403 });
    return commentRepository.editComment(id, content);
}

export async function deleteComment(id: string, commenterId: string, sessionId: string) {
    if(!id) throw Object.assign(new Error("Id is required"));
    if(sessionId !== commenterId) throw Object.assign(new Error("Unauthorized"), { status: 403 });
    commentRepository.deleteComment(id);
    return { deleted: true };
}

export async function toggleLike(commentId: string, userId: string) {
    if(!commentId) throw Object.assign(new Error("Comment id is required"));
    if(!userId) throw Object.assign(new Error("User id is required"));
    return commentRepository.toggleLike(commentId, userId);
}