import Immutable from 'immutable';

/* eslint new-cap: [0] class-methods-use-this: [0]*/
const { Record } = Immutable;

export class User extends Record(
    {
        _class: null,
        _links: null,
        email: null,
        fullName: null,
        id: null,
    }
) {
    isAnonymous() {
        return false;
    }
}

export class AnonUser {
    isAnonymous() {
        return true;
    }
}
