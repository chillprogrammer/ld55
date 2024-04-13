

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Do not modify any code in this file unless you know exactly what you are doing. You have been warned. //
///////////////////////////////////////////////////////////////////////////////////////////////////////////





/**
 * The ServiceInjector class.
 * Used for storing an retrieving instantiated objects to be used as services.
 * 
 * To use the ServiceInjector, simply:
 *
 *      1. import ServiceInjector into the desired file.
 *      2. Then call ServiceInjector.getServiceByClass(CLASS_NAME); to return the initialized object.
 *      2.1     i.e.    let obj: Object = ServiceInjector.getServiceByClass(Object);
 */
export class ServiceInjector {

    // This list stores the instantiated objects.
    private static listOfServices: any[] = [];

    /**
     * Returns the instantiated service object specified by class name.
     * @param classType The Class of the injected service
     * @returns Returns the service if it exists. Returns undefined if the service does not exist.
     */
    public static getServiceByClass(classType: any): any {

        // Retrieve the service object, or undefined.
        const service = ServiceInjector.findService(classType);

        // If service was initialized already, then we return it.
        if (service) {
            return service
        }

        // Service does not exist in memory yet. We need to initialize it before returning it.
        ServiceInjector.listOfServices.push(new classType());
        return ServiceInjector.findService(classType);
    }

    /**
     * Loops through list of instantiated services. If it exists, then it returns. 
     * Otherwise it returns undefined.
     * @param classType The name of the class to return as a service.
     * @returns Service object or undefined.
     */
    private static findService(classType: any) {
        for (const service of ServiceInjector.listOfServices) {
            if (service instanceof classType) {
                return service;
            }
        }
    }
}