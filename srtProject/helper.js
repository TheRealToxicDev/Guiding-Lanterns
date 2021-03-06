const array=[
    [ '727',
      '00:39:07,694 --> 00:39:09,661',
      'Of course! I want her to feel safe.' ],
    [ '728',
      '00:39:09,696 --> 00:39:12,630',
      'I want her to be taken care of\nand I want her to be happy here.' ],
    [ '729',
      '00:39:12,666 --> 00:39:15,433',
      'Funny, you seem to have\na pretty good handle' ],
    [ '730',
      '00:39:15,468 --> 00:39:16,668',
      'on the things you want.' ]
]
//Functions for manipulating the above array

//Remove subtitle block 728
array.filter(block => block[0] !== '728')

//
function replaceAt(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}
array.map(b => replaceAt(b,0,Number(b[0]))).forEach(a => console.log(a))

console.log(array)
//Concat all subtitle text
console.log([array.map(block => block[2]).join('\n')])
/*
Of course! I want her to feel safe.
I want her to be taken care of
and I want her to be happy here.
Funny, you seem to have
a pretty good handle
on the things you want.
*/

//Concat all subtitle text.
//If same numeric counter then join lines of subtitles with a space
console.log(array.map(block => block[2].replace(/\n/g,' ')).join('\n'))
/*
Of course! I want her to feel safe.
I want her to be taken care of and I want her to be happy here.
Funny, you seem to have a pretty good handle
on the things you want.
*/
