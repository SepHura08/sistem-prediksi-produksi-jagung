import { InputHTMLAttributes, forwardRef } from 'react';

export default forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
>(function Checkbox(props, ref) {
    return (
        <input
            {...props}
            type="checkbox"
            ref={ref}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
        />
    );
});