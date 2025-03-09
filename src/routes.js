const Home = React.lazy(() => import("./pages/home/Home"));

const routes = [
    {path: '/home', exact: true, name: 'Home', element: Home}
]

export default routes;