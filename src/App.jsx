
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Dashboard, HomeLayout, Landing, Login, Logout, Register } from "./pages";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Friends from "./components/Friends";
import { ToastContainer, toast } from 'react-toastify';
const router = createBrowserRouter([
  {
    
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
        },
        {
          path: "login",
          element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
            },
          {
            path: "profile",
            element: <Profile />,
            },
          {
            path: "post",
            element: <Post />,
            },
          {
            path: "friends",
            element: <Friends />,
            },
          
            {
              path: "dashboard/*",
              element: <Dashboard />,
              },
              {
                path: "logout",
                element: <Logout />,
                }
                ],
                },
                ]);
                console.log("rendered");
function App() {        
return (
    <>        
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </>
  )
}

export default App
