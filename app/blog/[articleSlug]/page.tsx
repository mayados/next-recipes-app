"use client"
import Comment from '@/components/Comment'
import Tag from '@/components/Tag'
import Title from '@/components/Title'
import { formatDate } from '@/lib/utils'
import { useEffect, useState, FormEvent } from "react";
import { BookText } from 'lucide-react';
import Image from 'next/image'
import { MessageSquareText } from 'lucide-react';
import CommentForm from '@/components/CommentForm'


const ArticleDetailPage = ({params}: {params: {articleSlug: string}}) => {

    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null)
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState({text: ""})

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`/api/blog/${params.articleSlug}`)
            const data: ArticleWithTagsAndComments = await response.json()
            setArticle(data)
            setComments(data.comments); 
            console.log(data);

        }
        fetchArticle()
    }, [params.articleSlug])


    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/comments/delete/${commentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
        }
      }

      const handleCommentInputChange = (e: React.ChangeEvent) => {
        setNewComment({ text: e.target.value });
    };

    const addComment = async (e : FormEvent) => {
        // We don't want the form to refresh the page when submitted
        e.preventDefault()
        try{

            const response = await fetch(`/api/comments/commentsArticle`, {
                method: "POST",
                // We use JSON.stringify to assign key => value in json string
                body: JSON.stringify({text: newComment.text,
                    userId: "6718be46cbfe3064f8998c23",
                    articleId: "671b41a217e9611c3eec8ee7",
                    createdAt: new Date().toISOString() 
                })
            });
            if (response.ok) {
                const commentAdded = await response.json();
                setComments(prevComments => [commentAdded['comment'],...prevComments, ]); 
                setNewComment({text: ""});                        
            }

        }catch(error){
            console.error("Erreur lors de l'ajout du commentaire :", error);
        }

    }

  return (
    <div className='p-5'>
        <section className='bg-slate-800 flex flex-col gap-5 items-center justify-center h-[50vh] '>
            <div className='my-5 flex flex-wrap gap-3 '>
                {article?.tags.map((tagArticle: TagArticleType) => (
                    <Tag key={tagArticle.tag.id} name={tagArticle.tag.name} />
                ))}
            </div>
            <h1 className='text-2xl font-bold'>{article?.title}</h1>  
            {/* Erreur avec la date  */}
            {/* <p className='text-sm text-slate-300'>{formatDate(article?.createdAt)}</p>           */}
        </section>
        <section className='my-5'>
            <Title label="Introduction" icon={BookText}  />
            <p>{article?.text}</p>
            <div className='bg-slate-800 mt-3 py-3 px-2 flex gap-3 my-3'>
                <Image
                    className="h-[50px] w-[50px] object-cover rounded-[50%]"
                    src={`https://res.cloudinary.com/${cloudName}/${article?.user.picture}`}
                    width={500}
                    height={500}
                    alt="Picture profile of the user"
                />
                <div>
                    <p className='text-bold'>{article?.user.pseudo}</p>
                    {/* Add database column for description */}
                    <p className='text-sm text-gray-500'>Published on </p>
                </div>
            </div>
        </section>
        <section>
            <Title label={`Comments (${comments.length})`} icon={MessageSquareText}  />
            {comments.map((comment) => (

                <Comment key={comment.id} comment={comment} action={() => deleteComment(comment.id)} bgColor ="bg-slate-800"  />
            ))}
            <CommentForm name="text" placeholder="Write your comment here..." action={addComment} type="submit" value={newComment.text} onChange={handleCommentInputChange}  />
        </section>
    </div>
  )

}

export default ArticleDetailPage