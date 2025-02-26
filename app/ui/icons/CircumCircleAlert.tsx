import React, { SVGProps } from 'react'

export function CircumCircleAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.5 9a.5.5 0 0 0-1 0v4.02a.5.5 0 0 0 1 0Z"></path><circle cx="12" cy="15.001" r=".5" fill="currentColor"></circle><path fill="currentColor" d="M12 21.935A9.933 9.933 0 1 1 21.934 12A9.945 9.945 0 0 1 12 21.935m0-18.866A8.933 8.933 0 1 0 20.934 12A8.944 8.944 0 0 0 12 3.069"></path></svg>
  )
}
export default CircumCircleAlert