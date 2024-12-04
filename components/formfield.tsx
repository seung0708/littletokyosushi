import { ItemFormFieldProps } from "@/types/definitions";

const FormField: React.FC<ItemFormFieldProps> = ({
    type,
    placeholder, 
    name, 
    register, 
    valueAsNumber, 
    error
}) => (
    <>
    <input 
        type={type}
        placeholder={placeholder}
        {...register(name, {valueAsNumber})}
    />
    {error && <span className="error-message">{error.message}</span>}
    </>
)