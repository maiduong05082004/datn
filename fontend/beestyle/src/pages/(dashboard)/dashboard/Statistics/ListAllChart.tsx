
import React from 'react'
import ListStatistics from './list'
import ListTopSelling from './listtopselling'
type Props = {}

const ListAllChart = (props: Props) => {
    return (
        <div className='p-5'>
            <h2>Thống kê tổng quát</h2>

            <div className=''>
                <ListStatistics />
                <ListTopSelling />
            </div>
        </div>
    )
}

export default ListAllChart