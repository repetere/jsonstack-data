//@ts-ignore
import stemmer from 'stemmer';
const natural = {
    PorterStemmer: {
        tokenizeAndStem: (input = '') => {
            const stems = input
                .split(' ')
                .map(word => word.trim())
                .filter(word => word)
                .map(stemmer);
            // console.log({ stems });
            return stems;
        }
    }
};
export default natural;
