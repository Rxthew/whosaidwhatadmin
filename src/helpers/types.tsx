
export interface CommentInterface {
    _id: string,
    content: string,
    date: string,
    post: string,
    user: UserInterface
    
}

export type CommentsType = ReadonlyArray<CommentInterface>


export interface FormDialogProps {
    button: (clickHandler: () => void) => JSX.Element
    delete: boolean,
    handleSubmitConstructor: (params: SubmitConstructorParams) => (event: React.FormEvent<HTMLFormElement>) => Promise<void>
    inputLabel: string,
    inputText: string,
    content?: string,
    submitLabel?: string,
    title?: string,
    titleLabel?: string
  
  }

type NotificationActionKeys = 'Add Comment' | 'Delete Comment' | 'Edit Comment' | 'Add Post' | 'Delete Post' | 'Edit Post' | 'Default'
export interface NotificationActionInterface {
    type: NotificationActionKeys,
}

interface NotificationStateDetails {
    message: string
    status: boolean
}

export interface NotificationReducerInterface {
    'Add Comment Notify': NotificationStateDetails
    'Delete Comment Notify': NotificationStateDetails   
    'Edit Comment Notify': NotificationStateDetails
    'Add Post Notify': NotificationStateDetails
    'Delete Post Notify': NotificationStateDetails   
    'Edit Post Notify': NotificationStateDetails
    
}


interface PostInterface { 
    _id: string,
    title: string,
    content: string,
    date: string,
    published_status: boolean,
    user: UserInterface,
    comments: CommentsType
}


export type PostsType = ReadonlyArray<PostInterface>

export interface SubmitConstructorParams {
    resetIndexData: () => void,
    resetLoadingState: null | (() => void),
    setErrors:  React.Dispatch<React.SetStateAction<Record<string, Record<string, string | boolean>>>>
    setNotifications: React.Dispatch<NotificationActionInterface> | null

}

export interface UserInterface { 
    _id: string,
    username: string,
    member_status: "regular" | "privileged" | "admin"
    first_name?: string,
    last_name?: string
}


export interface IndexInterface {
    user: UserInterface | null,
    posts: PostsType | null,
    resetIndexData: () => void,
    setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>
    setPosts: React.Dispatch<React.SetStateAction<PostsType | null>>
}