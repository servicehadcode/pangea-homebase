
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { addDiscussionComment, upvoteComment, DiscussionComment } from '@/services/discussionService';

interface DiscussionItemProps {
  comment: DiscussionComment;
  onReply: (comment: DiscussionComment) => void;
  onUpvote: (commentId: string) => void;
}

export const DiscussionItem = ({ comment, onReply, onUpvote }: DiscussionItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter a reply before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`Submitting reply to comment ID: ${comment.id}`);
      const newReply = await addDiscussionComment({
        problemId: comment.problemId,
        content: replyContent,
        userId: 'current-user',
        username: 'Current User',
        parentId: comment.id
      });

      onReply(newReply);
      setReplyContent('');
      setIsReplying(false);

      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpvote = async (commentId: string) => {
    try {
      console.log(`Upvoting comment with ID: ${commentId}`);
      await upvoteComment(commentId);
      onUpvote(commentId);
      
      toast({
        title: "Upvoted",
        description: "You upvoted this comment."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote comment.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between mb-1">
        <div className="font-semibold">{comment.username}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(comment.timestamp).toLocaleString()}
        </div>
      </div>
      <div className="mb-3">{comment.content}</div>
      
      <div className="flex items-center gap-2 mb-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleUpvote(comment.id)}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          {comment.votes || 0}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleReplySubmit}
            >
              Post Reply
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-3 pl-4 border-l-2 border-gray-200">
          {comment.replies.map(reply => (
            <div key={reply.id} className="p-3 bg-secondary/20 rounded-md">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{reply.username}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(reply.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="mb-2">{reply.content}</div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleUpvote(reply.id)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                {reply.votes || 0}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
