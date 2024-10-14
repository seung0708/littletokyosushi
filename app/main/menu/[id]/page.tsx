import {useRouter} from 'next/router';
import {products} from '@/types/products';

const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const {id} = router.query;

    return(
        <div></div>
    )
}

export default ProductDetailsPage