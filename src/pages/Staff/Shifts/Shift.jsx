import React, { useEffect, useState } from 'react'
import { fetchData } from '../../../utils';
import { base_url } from '../../../utils/url';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const getShift = `${base_url}/get-single-shift/`;

const Shift = () => {
  const params = useParams();
  const user = useSelector(state => state.user);
  const [data, setData] = useState(null);

  const id = params?.id;

  console.log('data', data)

  useEffect(() => {
    fetchData({
      url: getShift + id,
      callback: (data) => setData(data)
    })
  }, [id])
  
  return (
    <div>Job</div>
  )
}

export default Shift