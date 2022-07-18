/// <reference types="jest" />
export declare const createMockProxy: <Type>(objectName?: string) => { [P in keyof Type]: Type[P] extends (...args: any[]) => any ? jest.MockInstance<ReturnType<Type[P]>, jest.ArgsType<Type[P]>> : Type[P] extends jest.Constructable ? jest.MockedClass<Type[P]> : Type[P]; } & Type & {
    mockClear(): void;
};
export declare const createProxyFromMock: <Type extends new (...args: any[]) => any>(mock: Type) => { [P in keyof InstanceType<Type>]: InstanceType<Type>[P] extends (...args: any[]) => any ? jest.MockInstance<ReturnType<InstanceType<Type>[P]>, jest.ArgsType<InstanceType<Type>[P]>> : InstanceType<Type>[P] extends jest.Constructable ? jest.MockedClass<InstanceType<Type>[P]> : InstanceType<Type>[P]; } & InstanceType<Type> & {
    mockClear(): void;
};
