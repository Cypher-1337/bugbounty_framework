import React, { useContext } from 'react';
import Domains from './Domains'
import Alive from './Alive'
import Subdomains from './Subdomains'
import { AppContext } from '../../App'; // for app Context


export default function DomainsData() {

  const {data} = useContext(AppContext)

  return (
    <div className='dashboard'>




      { data === 'alive' && <Alive /> }
      { data === 'domains' && <Domains /> }
      { data === 'subdomains' && <Subdomains /> }
         
    </div>
  );
}
