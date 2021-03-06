import {Button} from 'my-compo-test'

console.log(Button)


// 1.手动按需引入
// import Button from 'my-compo-test/lib/components/Button'

// console.log(Button)


// 2.借助babel-plugin-import引入
// import {Button} from 'my-compo-test'

// console.log(Button)


// 3.借助tree-shaking
// import {Button} from 'my-compo-test'

// console.log(Button)

// 4.使用monorepo的按需引入
// import Button from '@my-compo-test/button'

// console.log(Button)

// 4.使用monorepo的全部引入
// import {Button} from '@my-compo-test/main'

// console.log(Button)