"use client";

import { useEffect, useState, FormEvent } from "react";
import Button from "@/components/Button";
import { CircleX, SendHorizontal, CirclePlus } from 'lucide-react';
import { Field, Textarea, Input } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ModifyArticle = ({ params }: { params: { articleSlug: string } }) => {
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [comments, setComments] = useState<[]>([]);
    const [tags, setTags] = useState<TagArticleType[]>([]);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const router = useRouter();

    useEffect(() => {
        const fetchArticle = async () => {
            // URL corrigée sans double barre oblique
            const response = await fetch(`/api/admin/blog/articles/${params.articleSlug}`);
            const data: ArticleWithTagsAndComments = await response.json();

            setArticle(data);
            setTitle(data?.title);
            setText(data.text);
            setTags(data.tags); 

            console.log(data);
        };

        fetchArticle();
    }, [params.articleSlug]);

    const modifyArticle = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const slugArticle = article?.slug;
            const newSlug = slugify(title);
            console.log("slug de l'article : "+slugArticle)
            console.log("nouveau slug de l'article : "+newSlug)

            const response = await fetch(`/api/admin/blog/articles/modify`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    text,
                    tags,
                    slugArticle,
                    newSlug
                }),
            });
            if (response.ok) {
                toast.success("Article updated successfully!");
                console.log("Le nouveau slug est : "+newSlug)
                console.log(article)
                if (newSlug !== slugArticle) {
                    try {
                        await router.replace(`/admin/blog/articles/${newSlug}`);
                    } catch (err) {
                        console.error("Redirection to the article failed:", err);
                    }
                } else {
                    toast.loading("Le slug est inchangé.");
                }
            }
        } catch (error) {
            console.error("Error during article modification:", error);
            toast.error("There was a problem updating the article. Please try again!");
        }
    };

    const addTag = () => {
        setTags((prevTags) => [
            ...prevTags,
            { tag: { name: "" }, number: prevTags.length + 1, }
        ]);
    };

    const removeTag = (index: number) => {
        setTags((prevTags) => {
            const newTags = prevTags
                .filter((_, i) => i !== index)
                .map((tag, idx) => ({ ...tag, number: idx + 1 }));

            return newTags;
        });
    };

    const handleTagChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTags((prevTags) =>
            prevTags.map((tag, idx) =>
                idx === index
                    ? { ...tag, tag: { ...tag.tag, name: value } }
                    : tag
            )
        );
    };

    return (
        <>
            <div><Toaster/></div>
            <h1 className="text-3xl text-white ml-3 text-center">Article : {title}</h1>
            <div><Toaster /></div>
            <form onSubmit={modifyArticle} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <div>
                    <label htmlFor="">Title</label>
                    <Field className="w-full">
                        <Input
                            name="title"
                            className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field>
                </div>
                <div>
                    <label htmlFor="">Text</label>
                    <Field className="w-full">
                        <Textarea
                            name="text"
                            className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </Field>
                </div>
                <h2>Tags</h2>
                {tags.map((tag, index) => (
                    <div key={index}>
                        <label htmlFor="">Tag {tag.number}</label>
                        <Input
                            type="text"
                            name="text"
                            placeholder="tag's text"
                            value={tag?.tag?.name || ""}
                            onChange={(event) => handleTagChange(index, event)}
                            className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                        />
                        <Button label="Remove tag" icon={CircleX} type="button" action={() => removeTag(index)} className="text-red-500" />
                    </div>
                ))}
                <Button label="Add tag" icon={CirclePlus} type="button" action={addTag} className="text-red-500" />

                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </>
    );
};

export default ModifyArticle;
