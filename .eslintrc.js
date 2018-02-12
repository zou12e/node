module.exports = {
    extends: '@fmfe/fmfe-nodejs',
    // 所有规则http://eslint.org/docs/rules/
    rules: {
        // 是否可以使用call或者apply
        'no-useless-call': ['off'],
        // 箭头函数参数仅有一个时，不需要加括号
        'arrow-parens': ['error', 'as-needed']
    }
};