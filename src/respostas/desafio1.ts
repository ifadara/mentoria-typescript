interface IEmployee {
    code: number,
    name: string
}

class Employee{
    code = 10;
    name = 'John'
    
    constructor(code: number, name: string){
        this.code = code;
        this.name = name;
    }
}