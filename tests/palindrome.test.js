const { palindrome } = require('../utils/for_testing')


// describe('palindrome', () => {

test('palindrome de joaco', () => {
    const result = palindrome('joaco')
    expect(result).toBe('ocaoj')
})


test('palindrome de empty', () => {
    const result = palindrome('')
    expect(result).toBe('')
})

test('palindrome de undefined', () => {
    const result = palindrome()
    expect(result).toBeUndefined()
})

// })