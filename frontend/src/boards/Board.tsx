import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PostChirp, UserContext } from "../App"
import Layout from "../Layout"
import SpinningCircle from "../SpinningCircle"
import Comment from "./Comment"
import ReplyBox from "./ReplyBox"
import Vote from "./Vote"

export interface Post extends PostChirp {
    commentCount: number
}

function Board() {
    const [mainPost, setMainPost] = useState<Post | null>(null)

    const [comments, setComments] = useState<JSX.Element[]>([])
    //local comments are sent to the server, but also store them here to avoid a 2nd fetch
    const [localComments, setLocalComments] = useState<JSX.Element[]>([])

    const [pageNum, setPageNum] = useState(1); //start at 1 because the first page is already loaded
    const [replying, setReplying] = useState(false)

    const params = useParams();
    const navigate = useNavigate();

    const userInfo = useContext(UserContext);
    
    useEffect( () => {
        if (params && params.id) {
            fetchPost(params.id);
        }
    }, [] )

    const fetchPost = async (postId: string) => {
        const url = process.env.NODE_ENV !== "production" ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL
        const timezone = (-(new Date().getTimezoneOffset() / 60)).toString()

        const query =
        `query {    
            post(id: "${postId}"${userInfo.state.username ? `, relatedUsername: "${userInfo.state.username}"` : ""}) {
                author {
                    username
                    displayName
                }
                text
                isComment
                postDate(timezone: ${timezone})
                score
                commentCount
                ${userInfo.state.username ? "voteStatus" : ""}
                comments(first:0, offset:5) {
                    id
                    text
                    commentCount
                    postDate(timezone: ${timezone})
                    score
                    ${userInfo.state.username ? "voteStatus" : ""}
                    author {
                        username
                        displayName
                    }
                }
            }
        }`

        const response = await fetch(url ?? '', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({query})
        }).then(res => res.json())
        console.log(response)

        const info = response.data.post;
        if (!info || info.isComment)
            navigate("/")

        setMainPost({
            id: postId,
            text: info.text,
            voteStatus: userInfo.state.username ? info.voteStatus : null,
            postDate: info.postDate,
            authorUsername: info.author.username,
            authorDisplayName: info.author.displayName,
            commentCount: info.commentCount,
            score: info.score,

        })

        setComments(info.comments.map((comment: any) => {
            return <Comment
                key = {comment.id}
                id = {comment.id}
                text = {comment.text}
                postDate = {comment.postDate}
                authorUsername = {comment.author.username}
                authorDisplayName = {comment.author.displayName}
                commentCount = {comment.commentCount}
                voteStatus = {userInfo.state.username ? comment.voteStatus : null}
                score = {comment.score}
                local = {false}
            />
        }))
    }

    const loadMoreComments = async () => {
        if (!mainPost)
            return;

        const timezone = (-(new Date().getTimezoneOffset() / 60)).toString()
        const url = process.env.NODE_ENV !== "production" ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL
        const query =
        `query {    
            post(id: "${mainPost.id}") {
                comments(first:${pageNum}, offset:5) {
                    id
                    text
                    commentCount
                    postDate(timezone: ${timezone})
                    score
                    ${userInfo.state.username ? `voteStatus(username: "${userInfo.state.username}")` : ""}
                    author {
                        username
                        displayName
                    }
                }
            }
        }`

        
        const response = await fetch(url ?? '', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({query})
        }).then(res => res.json())
        
        console.log(response)
        
        const info = response.data.post;
        if (!info || info.isComment)
            navigate("/");

        setPageNum(pageNum + 1)

        setComments(comments.concat(
            info.comments.map((comment: any) => {
                return <Comment
                    key = {comment.id}
                    id = {comment.id}
                    text = {comment.text}
                    postDate = {comment.postDate}
                    authorUsername = {comment.author.username}
                    authorDisplayName = {comment.author.displayName}
                    commentCount = {comment.commentCount}
                    score = {comment.score}
                    voteStatus = {userInfo.state.username ? info.voteStatus : null}
                    local = {false}
                />
            }))
        )
    }



    return (
        <Layout>
            {mainPost ? 
            <div className = "mx-auto w-11/12 md:w-4/5 lg:w-3/4">

                <div className = "w-full mt-12 mb-6 p-8 border border-black rounded-xl bg-sky-100 relative break-all">

                    <a href={`/profile/${mainPost.authorUsername}`} className = "absolute -top-8 left-2 bg-white text-black rounded-xl p-2 border border-black">
                        {mainPost.authorDisplayName}
                        <div className="text-xs inline"> {`@${mainPost.authorUsername}`} </div>
                        <div className = "text-xs"> {mainPost.postDate} </div>
                    </a>

                    {mainPost.text}
                    <Vote postId = {mainPost.id} initialScore = {mainPost.score} initialVoteStatus = {mainPost.voteStatus}/>

                    {replying ?
                    <ReplyBox postId = {mainPost.id} close = {() => {setReplying(false)}} 
                        addReply = {(reply) => {
                            setLocalComments([reply, ...localComments])
                        }}/> 
                    : 
                    <button className = "px-2 py-1 absolute -bottom-3 right-12 bg-gray-200 text-black border border-black/20 rounded shadow-md text-xs" 
                        onClick = {() => {setReplying(true)}}>
                            Reply
                    </button>
                    }
                </div>
                
                
                <div className = "w-full border-l mb-10 border-l-gray-200">
                    {localComments.length > 0 ? localComments.concat(comments) : comments}

                    {comments.length < mainPost.commentCount ?
                        <p onClick = {loadMoreComments} className = "cursor-pointer ml-[5%] text-sky-100">Load more comments</p>
                    : null}
                </div>                

            </div> 

            :
            <SpinningCircle />}
        </Layout>
    )


}


export default Board