import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();


export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x74AB625093bDaF9E2cD0aCe8B93904183B843eeE');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            console.log(address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image);

            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image
                ]
            })

            console.log(data);
            console.log("contract call sucess", data);

        } catch (error) {
            console.log("contract call failure", error);
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaigns, id) => ({
            owner: campaigns.owner,
            title: campaigns.title,
            description: campaigns.description,
            target: ethers.utils.formatEther(campaigns.target.toString()),
            deadline: campaigns.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaigns.amountCollected.toString()),
            image: campaigns.image,
            pId: id
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) =>
            campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });

        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </StateContext.Provider>
    )
};

export const useStateContext = () => useContext(StateContext);