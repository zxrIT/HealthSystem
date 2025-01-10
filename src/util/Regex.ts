export default class Regex {
    static readonly regexIdentityCard: RegExp =
        /^[1-9]\d{5}(18|19|20|21|22)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/;

    static readonly regexMobile: RegExp =
        /^1\d{10}$/
}