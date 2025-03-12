import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a target="_blank" rel="noopener noreferrer">
          Caci
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
