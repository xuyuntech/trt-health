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
    Doctor: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
    Query: [
        {
            accessType: 'READ',
            permission: 'ALLOW',
            principalId: '$everyone',
            principalType: 'ROLE'
        },
    ],
};

module.exports = acls;