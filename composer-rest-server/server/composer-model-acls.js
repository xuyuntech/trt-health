'use strict';

const acls =  {
    Hospital: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
    ArrangementHistory: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
    Department1: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
    Department2: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
};

module.exports = acls;