import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import arbitrumLogo from '../../assets/arbitrum.png';
import CreateClaim from '../Claims/CreateClaim';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';

function BountyCard({ bounty, cancelBounty, wallet, refreshBounties }) {
  const { id, name, description, amount, claimer, issuer } = bounty;
  const [showCancel, setShowCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCreateClaim, setShowCreateClaim] = useState(false);

  useEffect(() => {
    if (wallet) {
      if (
        ethers.getAddress(wallet.accounts[0].address) ===
        ethers.getAddress(issuer)
      ) {
        setShowCancel(true);
      }
    }
  }, [wallet]);

  const truncatedDescription =
    description.length > 50
      ? `${description.substr(0, 10)}...${description.substr(
          description.length - 20,
          description.length
        )}`
      : description;

  const truncatedName =
    name.length > 30
      ? `${name.substr(0, 10)}...${name.substr(name.length - 20, name.length)}`
      : name;

  const handleClaimClick = () => {
    if (
      ethers.getAddress(claimer) !==
      ethers.getAddress('0x0000000000000000000000000000000000000000')
    ) {
      toast.info('This bounty has already been claimed.');
      return;
    }
    setShowCreateClaim(true);
  };

  const handleCancelClick = async () => {
    try {
      setCancelLoading(true);
      await cancelBounty(id);
      setCancelLoading(false);
      refreshBounties(true);
    } catch (error) {
      toast.error(`Error cancelling bounty: ${error.message}`);
    }
  };

  const handleCloseCreateClaim = () => {
    setShowCreateClaim(false);
  };

  return (
    <div className="bounty-card">
      <ToastContainer />
      <div className="bounty-card-title-amount-wrap">
        <div className="bounty-title">{truncatedName}</div>
        <div className="bounty-card-amount-wrap">
          <img
            className="bounty-card-amount-logo"
            src={arbitrumLogo}
            alt="Arbitrum logo"
          />
          <p className="bounty-card-amount">{amount}</p>
        </div>
      </div>
      <p className="bounty-description">{truncatedDescription}</p>
      <div className="bounty-details-button-wrap">
        <button
          type="button"
          className="bounty-details-button"
          onClick={handleClaimClick}
        >
          claim
        </button>
        <Link to={`/bounties/${id}`}>
          <button type="button" className="bounty-details-button">
            details
          </button>
        </Link>
        {showCancel && (
          <button
            type="button"
            className="bounty-details-button"
            onClick={handleCancelClick}
          >
            {cancelLoading ? (
              <BeatLoader color="white" loading={cancelLoading} size={5} />
            ) : (
              'Cancel'
            )}
          </button>
        )}
      </div>
      {showCreateClaim && (
        <CreateClaim bountyId={id} onClose={handleCloseCreateClaim} />
      )}
    </div>
  );
}

BountyCard.propTypes = {
  bounty: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    claimer: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
  }).isRequired,
  cancelBounty: PropTypes.func.isRequired,
  wallet: PropTypes.object,
  refreshBounties: PropTypes.func.isRequired,
};

export default BountyCard;