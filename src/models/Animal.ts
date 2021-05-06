export default class Animal {
    static properties = {
        size: { label: 'Größe', unit: 'm' },
        weight: { label: 'Gewicht', unit: 'kg' },
        age: { label: 'Alter', unit: 'Jahre' },
        offspring: { label: 'Nachkommen', unit: '' },
        speed: { label: 'Geschindigkeit', unit: 'km/h' },
    }

    name: string;
    image: string;
    size: number;
    weight: number;
    age: number;
    offspring: number;
    speed: number;

    constructor(name: string, image: string, size: number, weight: number, age: number, offspring: number, speed: number) {
        this.name = name;
        this.image = image;
        this.size = size;
        this.weight = weight;
        this.age = age;
        this.offspring = offspring;
        this.speed = speed;
    }

}
