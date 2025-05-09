// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "./TFHE.sol";
import "./FHEVMCoprocessorAddress.sol";
import "./ACLAddress.sol";

interface IFHEVMCoprocessor {
    function fheAdd(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheSub(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheMul(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheDiv(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheRem(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheBitAnd(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheBitOr(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheBitXor(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheShl(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheShr(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheRotl(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheRotr(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheEq(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheNe(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheGe(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheGt(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheLe(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheLt(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheMin(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheMax(uint256 lhs, uint256 rhs, bytes1 scalarByte) external returns (uint256 result);
    function fheNeg(uint256 ct) external returns (uint256 result);
    function fheNot(uint256 ct) external returns (uint256 result);
    function verifyCiphertext(
        bytes32 inputHandle,
        address callerAddress,
        bytes memory inputProof,
        bytes1 inputType
    ) external returns (uint256 result);
    function cast(uint256 ct, bytes1 toType) external returns (uint256 result);
    function trivialEncrypt(uint256 ct, bytes1 toType) external returns (uint256 result);
    function fheIfThenElse(uint256 control, uint256 ifTrue, uint256 ifFalse) external returns (uint256 result);
    function fheRand(bytes1 randType) external returns (uint256 result);
    function fheRandBounded(uint256 upperBound, bytes1 randType) external returns (uint256 result);
    function cleanTransientStorage() external;
}

interface IACL {
    function allowTransient(uint256 ciphertext, address account) external;
    function allow(uint256 handle, address account) external;
    function cleanTransientStorage() external;
    function isAllowed(uint256 handle, address account) external view returns (bool);
}

library Impl {
    function add(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheAdd(lhs, rhs, scalarByte);
    }

    function sub(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheSub(lhs, rhs, scalarByte);
    }

    function mul(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheMul(lhs, rhs, scalarByte);
    }

    function div(uint256 lhs, uint256 rhs) internal returns (uint256 result) {
        bytes1 scalarByte = 0x01;
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheDiv(lhs, rhs, scalarByte);
    }

    function rem(uint256 lhs, uint256 rhs) internal returns (uint256 result) {
        bytes1 scalarByte = 0x01;
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheRem(lhs, rhs, scalarByte);
    }

    function and(uint256 lhs, uint256 rhs) internal returns (uint256 result) {
        bytes1 scalarByte = 0x00;
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheBitAnd(lhs, rhs, scalarByte);
    }

    function or(uint256 lhs, uint256 rhs) internal returns (uint256 result) {
        bytes1 scalarByte = 0x00;
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheBitOr(lhs, rhs, scalarByte);
    }

    function xor(uint256 lhs, uint256 rhs) internal returns (uint256 result) {
        bytes1 scalarByte = 0x00;
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheBitXor(lhs, rhs, scalarByte);
    }

    function shl(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheShl(lhs, rhs, scalarByte);
    }

    function shr(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheShr(lhs, rhs, scalarByte);
    }

    function rotl(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheRotl(lhs, rhs, scalarByte);
    }

    function rotr(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheRotr(lhs, rhs, scalarByte);
    }

    function eq(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheEq(lhs, rhs, scalarByte);
    }

    function ne(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheNe(lhs, rhs, scalarByte);
    }

    function ge(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheGe(lhs, rhs, scalarByte);
    }

    function gt(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheGt(lhs, rhs, scalarByte);
    }

    function le(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheLe(lhs, rhs, scalarByte);
    }

    function lt(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheLt(lhs, rhs, scalarByte);
    }

    function min(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheMin(lhs, rhs, scalarByte);
    }

    function max(uint256 lhs, uint256 rhs, bool scalar) internal returns (uint256 result) {
        bytes1 scalarByte;
        if (scalar) {
            scalarByte = 0x01;
        } else {
            scalarByte = 0x00;
        }
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheMax(lhs, rhs, scalarByte);
    }

    function neg(uint256 ct) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheNeg(ct);
    }

    function not(uint256 ct) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheNot(ct);
    }

    // If 'control's value is 'true', the result has the same value as 'ifTrue'.
    // If 'control's value is 'false', the result has the same value as 'ifFalse'.
    function select(uint256 control, uint256 ifTrue, uint256 ifFalse) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheIfThenElse(control, ifTrue, ifFalse);
    }

    function verify(bytes32 inputHandle, bytes memory inputProof, uint8 toType) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).verifyCiphertext(
            inputHandle,
            msg.sender,
            inputProof,
            bytes1(toType)
        );
        IACL(ACL_CONTRACT_ADDRESS).allowTransient(result, msg.sender);
    }

    function cast(uint256 ciphertext, uint8 toType) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).cast(ciphertext, bytes1(toType));
    }

    function trivialEncrypt(uint256 value, uint8 toType) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).trivialEncrypt(value, bytes1(toType));
    }

    function rand(uint8 randType) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheRand(bytes1(randType));
    }

    function randBounded(uint256 upperBound, uint8 randType) internal returns (uint256 result) {
        result = IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).fheRandBounded(upperBound, bytes1(randType));
    }

    function allowTransient(uint256 handle, address account) internal {
        IACL(ACL_CONTRACT_ADDRESS).allowTransient(handle, account);
    }

    function allow(uint256 handle, address account) internal {
        IACL(ACL_CONTRACT_ADDRESS).allow(handle, account);
    }

    function cleanTransientStorage() internal {
        IACL(ACL_CONTRACT_ADDRESS).cleanTransientStorage();
        IFHEVMCoprocessor(FHEVM_COPROCESSOR_ADDRESS).cleanTransientStorage();
    }

    function isAllowed(uint256 handle, address account) internal view returns (bool) {
        return IACL(ACL_CONTRACT_ADDRESS).isAllowed(handle, account);
    }
}
