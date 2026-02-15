import { Zap } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <Zap {...props} className={`text-yellow-400 fill-yellow-400 ${props.className}`} />
    );
}
