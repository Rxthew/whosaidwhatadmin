import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Blog from './Blog'
import Error from './Error'
import Main from './Main'
import Login from './Login'
import User from './User'
import Signup from './Signup'
import Post from './Post'
import '@fontsource/roboto/400.css'



const blogRouter = createBrowserRouter([{
  path: '/',
  element: <Blog />,
  errorElement: <Error />,
  children: [
    {
      index: true,
      element: <Main />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/post/:postId',
      element: <Post /> 
    },
    {
      path: '/user/:userId',
      element: <User /> 
    }

  ]
}], {
  basename: '/whosaidwhatadmin/'
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={blogRouter}/>
  </React.StrictMode>,
)

