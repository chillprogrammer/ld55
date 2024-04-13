import { Subject } from 'rxjs'

/**
 * Keeps track of what keys are pressed.
 */
export class KeyManager {
    private keyList: string[] = [];
    private keyDownSubject: Subject<string> = new Subject<string>();
    private keyReleasedSubject: Subject<string> = new Subject<string>();

    constructor() {
        document.addEventListener('keydown', (ev: KeyboardEvent) => { this.keyDown(ev) })
        document.addEventListener('keyup', (ev: KeyboardEvent) => { this.keyReleased(ev) })
    }

    /**
     * Internal to KeyManagerService.
     * Runs when a key is pressed down.
     * @param ev 
     */
    private keyDown(ev: KeyboardEvent): void {
        const key: string = ev.key.toLowerCase();
			
        if (!this.keyList.includes(key)) {
            this.keyList.push(key);

            // Emit the key
            this.keyDownSubject.next(key);
        } else {
            if(key === 'Backspace') {
                this.keyDownSubject.next(key);
            }
        }
    }

    /**
     * Internal to KeyManagerService.
     * Runs when a key is released.
     * @param ev 
     */
    private keyReleased(ev: KeyboardEvent) {
        const key: string = ev.key.toLowerCase();
        if (this.keyList.indexOf(key) >= 0) {
            this.keyList = this.keyList.filter(function (x) {
                return x !== key;
            });

            // Emit the key
            this.keyReleasedSubject.next(key);
        }
    }

    /**
     * 
     * @param key string
     * @returns boolean for is the key is currently pressed or not.
     */
    public isKeyPressed(key: string): boolean {
        return this.keyList.includes(key);
    }

    /**
     * The Subject for when a key is pressed down.
     * Does not trigger again just by holding the key down.
     * @returns a Subject
     */
    public getKeyDownSubject(): Subject<string> { return this.keyDownSubject; }

    
    /**
     * The Subject for when a key is released.
     * @returns a Subject
     */
    public getKeyReleasedSubject(): Subject<string> { return this.keyReleasedSubject; }


}
