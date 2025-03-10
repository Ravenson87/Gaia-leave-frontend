import React from 'react'
import {useLocation} from 'react-router-dom'

import routes from '../routes'

import {CBreadcrumb, CBreadcrumbItem} from '@coreui/react'
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";

const AppBreadcrumb = () => {
    const currentLocation = useLocation().pathname
  const cookies = new Cookies();
  const jwtToken = cookies.get('token')
  const decodedToken = jwtDecode(jwtToken)
  let home;
  if (decodedToken.role === "super_admin") {
    home = "/#/dashboard/role-list"
  } else {
    home = "/#/profile"
  }
    const getRouteName = (pathname, routes) => {
        const currentRoute = routes.find((route) => route.path === pathname)
        return currentRoute ? currentRoute.name : false
    }

    const getBreadcrumbs = (location) => {
        const breadcrumbs = []
        location.split('/').reduce((prev, curr, index, array) => {
            const currentPathname = `${prev}/${curr}`
            const routeName = getRouteName(currentPathname, routes)
            routeName &&
            breadcrumbs.push({
                pathname: currentPathname,
                name: routeName,
                active: index + 1 === array.length,
            })
            return currentPathname
        })
        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs(currentLocation)

    return (
        <CBreadcrumb className="m-0 ms-2">
            <CBreadcrumbItem href={home}>Home</CBreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => {
                return (
                    <CBreadcrumbItem
                        {...(breadcrumb.active ? {active: true} : {href: `/#${breadcrumb.pathname}`})}
                        key={index}
                    >
                        {breadcrumb.name}
                    </CBreadcrumbItem>
                )
            })}
        </CBreadcrumb>
    )
}

export default React.memo(AppBreadcrumb)
