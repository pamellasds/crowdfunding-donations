import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton, CountBox, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const { getDonations, contract, address, donate } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    console.log(data.length);
    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount); 

    navigate('/')
    setIsLoading(false);
  }


  const remainingDays = daysLeft(state.deadline)
  return (
    <div>
      {isLoading && <Loader/>}

      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt="campaign" className='w-full h-[410px] object-cover rounded-x1' />
          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
            <div className='absolute h-full bg-[#4acd8d]' style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
          <CountBox title='Days Left' value={remainingDays}></CountBox>
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}></CountBox>
          <CountBox title='Total Backers' value={donators.length}></CountBox>
        </div>
      </div>

      <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>

          <div>
            <h4 className='text-white text-[18px] font-epilogue font-semibold p-3 uppercase'>Creator</h4>
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <div className='w-[52px] h-[52px] flex flex-row items-center justify-center rounded-full bg-[#2c2f32] cursor-contain'>
                <img src={thirdweb} alt="user" className='w-[60%] h-[60%] object-contain' />
              </div>
              <div>
                <h4 className='text-white font-epilogue font-semibold text-[14px] break-all'>{state.owner}</h4>
                <p className='text-[#808191] mt-[4px] font-epilogue font-normal text-[12px] break-all'>10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-white text-[18px] font-epilogue font-semibold uppercase'>Story</h4>
            <div className='mt-[20px]'>
              <p className='text-[#808191] font-epilogue font-normal text-[16px] leading-[16px] text-justify'>{state.description}</p>
            </div>
          </div>


          <div>
            <h4 className='text-white text-[18px] font-epilogue font-semibold uppercase'>Donators</h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className='flex justify-between items-center gap-4'>
                  <p className='font-epilogue fonr-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>{index + 1}. {item.donator}</p>
                  <p className='font-epilogue fonr-normal text-[16px] text-[#808191] leading-[26px] break-all'>{item.donation}</p>
                </div>
              )) : (
                <p className='text-[#808191] font-epilogue font-normal text-[16px] leading-[16px] text-justify'>No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <h4 className='text-white text-[18px] font-epilogue font-semibold uppercase'>Fund</h4>

          <div className='my-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]"'>
            <p className='text-[#808191] font-epilogue font-medium text-[20px] leading-[30px] text-center'>
              Fund the campaign
            </p>
            <div className='mt-[30px] '>
              <input
                type="number"
                placeholder='ETH 0.1'
                step='0.01'
                className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] rounded-[10px] placeholder:text-[#4b5264]'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className='mt-[20px] mb-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                <h4 className='text-white font-epilogue font-semibold text-[14px] leading-[22px]'>Back it because you believe in it.</h4>
                <p className='text-[#808191] mt-[20px] font-epilogue font-normal leading-[22px]'>Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                style="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CampaignDetails