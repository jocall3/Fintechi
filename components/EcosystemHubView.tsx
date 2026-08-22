import React, { useContext, useRef, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { User, Post, Business } from '../types';
import Modal from './mint/Modal';
import Badge from './mint/Badge';

// ============================ SUB-COMPONENTS ============================

const UserProfileModal: React.FC<{ user: User | null; businesses: Business[]; onClose: () => void; }> = ({ user, businesses, onClose }) => {
    if (!user) return null;

    const userBusinesses = businesses.filter(b => b.owner_id === user.id);

    return (
        <Modal isOpen={!!user} onClose={onClose} title={`${user.display_name}'s Profile`}>
            <div className="flex items-start gap-4">
                <img src={user.profilePictureUrl} alt={user.display_name} className="w-24 h-24 rounded-full border-4 border-cyan-400/50 object-cover" />
                <div>
                    <h3 className="text-2xl font-bold text-white">{user.display_name} <span className="text-gray-400 font-normal text-lg">{user.handle}</span></h3>
                    <p className="text-cyan-300">{user.role}</p>
                    <p className="text-sm text-gray-400 mt-2 italic">"{user.bio}"</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                     <div><p className="text-xs text-gray-500">Wallet</p><p className="font-bold text-white">${user.wallet.balance.toLocaleString()}</p></div>
                     <div><p className="text-xs text-gray-500">Followers</p><p className="font-bold text-white">{user.followers.length}</p></div>
                     <div><p className="text-xs text-gray-500">Following</p><p className="font-bold text-white">{user.following.length}</p></div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200">State</h4>
                     <div className="flex gap-2 mt-1">
                        <Badge status="info">Mood: {user.state.mood}</Badge>
                        <Badge status="neutral">Activity: {user.state.activity}</Badge>
                     </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-200">Businesses</h4>
                    {userBusinesses.length > 0 ? (
                        userBusinesses.map(b => <div key={b.id} className="p-2 bg-gray-700/50 rounded-lg mt-1"><p className="text-sm text-white">{b.name}</p></div>)
                    ) : <p className="text-sm text-gray-500">No businesses owned.</p>}
                </div>
            </div>
        </Modal>
    );
};


const UserProfileCard: React.FC<{ user: User, onProfileClick: (user: User) => void }> = ({ user, onProfileClick }) => (
    <Card className="sticky top-6">
        <div className="flex flex-col items-center text-center">
            <button onClick={() => onProfileClick(user)} className="group">
                <img src={user.profilePictureUrl} alt={user.display_name} className="w-24 h-24 rounded-full border-4 border-cyan-400/50 object-cover group-hover:border-cyan-300 transition-colors" />
            </button>
            <h3 className="text-xl font-bold text-white mt-4">{user.display_name}</h3>
            <p className="text-sm text-cyan-300">{user.role}</p>
            <p className="text-xs text-gray-400 mt-2 px-4 italic">"{user.bio}"</p>
            <div className="flex justify-around w-full mt-4 pt-4 border-t border-gray-700/50">
                <div>
                    <p className="text-lg font-bold text-white">{user.followers.length.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-white">{user.following.length.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Following</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-white">${(user.netWorth / 1_000_000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">Net Worth</p>
                </div>
            </div>
        </div>
    </Card>
);

const CreatePost: React.FC<{ user: User; onCreatePost: (text: string) => void }> = ({ user, onCreatePost }) => {
    const [postText, setPostText] = useState('');

    const handlePost = () => {
        if (postText.trim()) {
            onCreatePost(postText);
            setPostText('');
        }
    };

    return (
        <Card>
            <div className="flex items-start gap-3">
                 <img src={user.profilePictureUrl} alt={user.display_name} className="w-10 h-10 rounded-full object-cover" />
                 <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Share an update, strategy, or new data..."
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    rows={3}
                />
            </div>
            <div className="flex justify-between items-center mt-2 pl-12">
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-white" disabled><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg></button>
                    <button className="p-2 text-gray-400 hover:text-white" disabled><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                </div>
                <button onClick={handlePost} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50" disabled={!postText.trim()}>Post</button>
            </div>
        </Card>
    );
};


const PostCard: React.FC<{ post: Post; onMint: (postId: string) => void; onLike: (postId: string) => void; onAddComment: (postId: string, text: string) => void; currentUser: User; }> = ({ post, onMint, onLike, onAddComment, currentUser }) => {
    const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText);
            setCommentText('');
        }
    };
    
    // FIX: The `Post` model was updated to use `created_tick` instead of `timestamp`. This change aligns the component with the `Post` interface, resolving a TypeScript error and ensuring the correct timestamp data is displayed.
    const timestamp = `tick ${post.created_tick}`;

    return (
    <Card>
        <div className="flex items-start gap-4">
            <img src={post.userProfilePic} alt={post.userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
                <div className="flex items-baseline gap-2">
                    <p className="font-bold text-white">{post.userName}</p>
                    <p className="text-xs text-gray-400">{timestamp}</p>
                </div>
                <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{post.content.text}</p>
                {post.content.imageUrl && <img src={post.content.imageUrl} alt="Post content" className="mt-3 rounded-lg border border-gray-700/50" />}
            </div>
        </div>
        <div className="flex justify-around items-center mt-4 pt-3 border-t border-gray-700/50 text-gray-400">
             {/* FIX: The `Post` interface nests `likes` within a `metrics` object. The code was updated to access `post.metrics.likes` instead of `post.likes`, resolving a TypeScript error and ensuring the correct like count is displayed. */}
             <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 text-sm transition-colors duration-200 ${post.likedByUser ? 'text-red-400' : 'hover:text-red-400'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={post.likedByUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {post.metrics.likes}</button>
             {/* FIX: The `Post` interface nests the comment count within a `metrics` object. The code was updated to access `post.metrics.comments` instead of `post.comments.length`, resolving a TypeScript error and ensuring the correct comment count is displayed. */}
             <button onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)} className="flex items-center gap-2 text-sm hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {post.metrics.comments}</button>
             <button 
                onClick={() => onMint(post.id)}
                disabled={!!post.nftId}
                className="flex items-center gap-2 text-sm hover:text-white disabled:text-cyan-400 disabled:cursor-default"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                {post.nftId ? 'Minted' : 'Mint'}
              </button>
             <button className="flex items-center gap-2 text-sm hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Send</button>
        </div>
        {isCommentSectionOpen && (
            <div className="mt-4 pt-3 border-t border-gray-700/50">
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-3">
                    {post.comments.length > 0 ? post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 text-xs">
                            <img src={comment.userProfilePic} alt={comment.userName} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                            <div className="bg-gray-700/50 p-2 rounded-lg">
                                <p className="font-bold text-white">{comment.userName}</p>
                                <p className="text-gray-300">{comment.text}</p>
                            </div>
                        </div>
                    )) : <p className="text-xs text-center text-gray-500">No comments yet.</p>}
                </div>
                <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                    <img src={currentUser.profilePictureUrl} alt={currentUser.display_name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <input 
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                </form>
            </div>
        )}
    </Card>
    );
};


const DataHub: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="sticky top-6">
            <h4 className="text-lg font-semibold text-white mb-3">Data Hub</h4>
            <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                 <p className="mt-2 text-sm text-gray-400">Drag & drop your CSV/XLS file here</p>
                 <p className="text-xs text-gray-500">or</p>
                 <input type="file" ref={fileInputRef} className="hidden" />
                 <button onClick={handleSelectFile} className="text-xs font-semibold text-cyan-300 hover:underline">Select a file from your device</button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Upload your financial data to let the AI generate custom charts, metrics, and speculative analysis.</p>
            <p className="text-xs text-gray-600 mt-2">Future: Connect Figma for automated brand asset analysis.</p>
        </Card>
    );
};


// ============================ MAIN VIEW ============================

const EcosystemHubView: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (!context) throw new Error("EcosystemHubView must be within a DataProvider.");
    
    // FIX: The `businesses` property was missing from the `DataContext`. It has been added to the context and is now destructured here to resolve the TypeScript error and provide data to the `UserProfileModal`.
    const { users, posts, businesses, createPost, mintPostAsNFT, likePost, addComment, simulateAiPost } = context;
    const currentUser = users[0];

    useEffect(() => {
        let timeoutId: number;
        
        const runSimulation = () => {
            simulateAiPost();
            const nextDelay = 15000 + Math.random() * 10000;
            timeoutId = window.setTimeout(runSimulation, nextDelay);
        };

        timeoutId = window.setTimeout(runSimulation, 10000);

        return () => window.clearTimeout(timeoutId);
    }, [simulateAiPost]);

    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
                <UserProfileCard user={currentUser} onProfileClick={setSelectedUser} />
            </aside>

            <main className="lg:col-span-2 space-y-6">
                <CreatePost user={currentUser} onCreatePost={createPost} />
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onMint={mintPostAsNFT}
                        onLike={likePost}
                        onAddComment={addComment}
                        currentUser={currentUser}
                    />
                ))}
            </main>

            <aside className="lg:col-span-1">
                <DataHub />
            </aside>
        </div>
        <UserProfileModal user={selectedUser} businesses={businesses} onClose={() => setSelectedUser(null)} />
        </>
    );
};

export default EcosystemHubView;