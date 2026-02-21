import React from 'react'
import Cricket from './Cricket';
import Football from './Football';
import Tennis from './Tennis';
function All({ onlyInplay }) {
  return (
    <div>
        <Cricket onlyInplay={onlyInplay} />
        <Football onlyInplay={onlyInplay} />
        <Tennis onlyInplay={onlyInplay} />
    </div>
  )
}

export default All