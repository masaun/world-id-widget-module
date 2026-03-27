// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi } from 'viem';

// @dev - The artifact of the WorldIDV3BadgeManagerForOffChainVerifiedProof contract, which contains the ABI and bytecode, is imported from the compiled JSON file. The ABI is then exported as a constant for use in other parts of the project where interaction with the WorldIDV3BadgeManager contract is required.
import artifactOfWorldIDV3BadgeManagerForOffChainVerifiedProof from '../artifacts/WorldIDV3BadgeManagerForOffChainVerifiedProof.sol/WorldIDV3BadgeManagerForOffChainVerifiedProof.json';

/**
 * @notice Contract ABIs of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
 * This file contains all the contract ABIs used across the project
 */
//export const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIN_VERIFIED_PROOF_ABI = artifactOfWorldIDV3BadgeManagerForOffChainVerifiedProof.abi as const;
export const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIN_VERIFIED_PROOF_ABI = artifactOfWorldIDV3BadgeManagerForOffChainVerifiedProof.abi as Abi

