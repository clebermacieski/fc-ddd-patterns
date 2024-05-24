import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogHandler from "../../customer/event/handler/send-email-when-customer-address-changed.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/send-email-when-customer-is-created.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/send-email-when-customer-is-created.handler2 copy";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();

    // --//--

    const eventDispatcher2 = new EventDispatcher();
    const eventHandler2 = new EnviaConsoleLog1Handler();
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher2.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher2.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);

    const customerCreatedEvent2 = new CustomerCreatedEvent({
      id: 1,
      name: "Customer 1",
    });

    eventDispatcher2.notify(customerCreatedEvent2);

    expect(spyEventHandler2).toHaveBeenCalled();
  });

  // --//--

  const eventDispatcher3 = new EventDispatcher();
  const eventHandler3 = new EnviaConsoleLog2Handler();
  const spyeventHandler3 = jest.spyOn(eventHandler3, "handle");

  eventDispatcher3.register("CustomerCreatedEvent", eventHandler3);

  expect(
    eventDispatcher3.getEventHandlers["CustomerCreatedEvent"][0]
  ).toMatchObject(eventHandler3);

  const customerCreatedEvent3 = new CustomerCreatedEvent({
    id: 1,
    name: "Customer 1",
  });

  eventDispatcher3.notify(customerCreatedEvent3);

  expect(spyeventHandler3).toHaveBeenCalled();

  // --//--

  const eventDispatcher4 = new EventDispatcher();
  const eventHandler4 = new EnviaConsoleLogHandler();
  const spyeventHandler4 = jest.spyOn(eventHandler4, "handle");

  eventDispatcher4.register("CustomerAddressChangedEvent", eventHandler4);

  expect(
    eventDispatcher4.getEventHandlers["CustomerAddressChangedEvent"][0]
  ).toMatchObject(eventHandler4);

  const customer = new Customer("123", "John");

  const address = new Address("Street 1", 123, "13330-250", "São Paulo");
  customer.changeAddress(address);

  const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);

  eventDispatcher4.notify(customerAddressChangedEvent);

  expect(spyeventHandler4).toHaveBeenCalled();
});
