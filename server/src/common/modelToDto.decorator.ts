import {ClassConstructor, plainToInstance} from "class-transformer";
import {isArray} from "class-validator";

export function ModelToDto<T>(dto: ClassConstructor<T>) {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await original.apply(this, args);
            return isArray(result)
                ? result.map((item: any) => {
                    return plainToInstance(dto, item.toObject({virtuals: true}));
                })
                : plainToInstance(dto, result.toObject({virtuals: true}));
        };
        return descriptor;
    };
}