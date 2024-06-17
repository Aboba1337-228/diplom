import { Outlet, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { useSelector } from "react-redux"
import { Header } from "./components/Header.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Auth } from "./pages/Auth.jsx"
import { Reg } from "./pages/Reg.jsx"
import { MainAdmin } from "./pages/Admin/MainAdmin.jsx"
import { Footer } from "./components/Footer.jsx"
import Lesson from "./pages/Lesson.jsx"
import NewLesson from "./pages/Admin/NewLesson.jsx"
import MainUser from "./pages/User/MainUser.jsx"
import Quiz from "./pages/User/Quiz.jsx"
import Result from "./pages/User/Result.jsx"
import Profile from "./pages/Profile.jsx"
import ReductProfile from "./pages/User/ReductProfile.jsx"
import Users from "./pages/Admin/Users.jsx"
import ReductLesson from "./pages/Admin/ReductLesson.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <Header />
            <Outlet />
            <Footer />
        </>,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/auth",
                element: <Auth />
            },
            {
                path: "/reg",
                element: <Reg />
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to={'/'} />
    },
])

const userRouter = createBrowserRouter([
    {
        path: "/",
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            {
                path: "/",
                element: <MainUser />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/redProfile",
                element: <ReductProfile />
            },
            {
                path: "/lessons/:lessonId",
                element: <Lesson />
            },
            {
                path: "/lessons/:lessonId/quiz",
                element: <Quiz />
            },
            {
                path: "/lessons/:lessonId/finish",
                element: <Result />
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to={'/'} />
    },
])

const adminRouter = createBrowserRouter([
    {
        path: "/",
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            {
                path: "/",
                element: <MainAdmin />
            },
            {
                path: "/lessons/:lessonId",
                element: <Lesson />
            },
            {
                path: "/reductLesson/:lessonId",
                element: <ReductLesson />
            },
            {
                path: "/newLesson",
                element: <NewLesson />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/users",
                element: <Users />
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to={'/'} />
    },
])

function App() {
    const token = useSelector((state) => state.auth.token)
    let jwt
    token ? jwt = jwtDecode(token) : null

    return (
        token ?
            jwt?.roleId == "ADMIN" ? <RouterProvider router={adminRouter} /> :
                <RouterProvider router={userRouter} /> :
            <RouterProvider router={router} />
    )
}

export default App
