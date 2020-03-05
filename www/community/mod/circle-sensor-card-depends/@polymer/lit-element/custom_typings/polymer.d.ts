/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


// NOTE: This is just enough typings to type-check lit-element. They've been
// copied from polymer/types and minorly changed to describe Polymer 3.0.

declare module '/local/community/mod/circle-sensor-card-depends/@polymer/polymer/lib/mixins/properties-changed.js' {
  /**
   * Element class mixin that provides basic meta-programming for creating one
   * or more property accessors (getter/setter pair) that enqueue an async
   * (batched) `_propertiesChanged` callback.
   *
   * For basic usage of this mixin, call `MyClass.createProperties(props)`
   * once at class definition time to create property accessors for properties
   * named in props, implement `_propertiesChanged` to react as desired to
   * property changes, and implement `static get observedAttributes()` and
   * include lowercase versions of any property names that should be set from
   * attributes. Last, call `this._enableProperties()` in the element's
   * `connectedCallback` to enable the accessors.
   */
  export function PropertiesChanged<T extends new (...args: any[]) => {}>(base: T): T & PropertiesChangedConstructor;

  export interface PropertiesChangedConstructor {
    new(...args: any[]): PropertiesChanged;

    /**
     * Creates property accessors for the given property names.
     *
     * @param props Object whose keys are names of accessors.
     */
    createProperties(props: object): void;

    /**
     * Returns an attribute name that corresponds to the given property.
     * The attribute name is the lowercased property name. Override to
     * customize this mapping.
     *
     * @param property Property to convert
     * @returns Attribute name corresponding to the given property.
     */
    attributeNameForProperty(property: string): string;

    /**
     * Override point to provide a type to which to deserialize a value to
     * a given property.
     *
     * @param name Name of property
     */
    typeForProperty(name: string): void;
  }

  export interface PropertiesChanged {

    /**
     * Creates a setter/getter pair for the named property with its own
     * local storage.  The getter returns the value in the local storage,
     * and the setter calls `_setProperty`, which updates the local storage
     * for the property and enqueues a `_propertiesChanged` callback.
     *
     * This method may be called on a prototype or an instance.  Calling
     * this method may overwrite a property value that already exists on
     * the prototype/instance by creating the accessor.
     *
     * @param property Name of the property
     * @param readOnly When true, no setter is created; the
     *   protected `_setProperty` function must be used to set the property
     */
    _createPropertyAccessor(property: string, readOnly?: boolean): void;

    /**
     * Adds the given `property` to a map matching attribute names
     * to property names, using `attributeNameForProperty`. This map is
     * used when deserializing attribute values to properties.
     *
     * @param property Name of the property
     */
    _addPropertyToAttributeMap(property: string): void;

    /**
     * Defines a property accessor for the given property.
     *
     * @param property Name of the property
     * @param readOnly When true, no setter is created
     */
    _definePropertyAccessor(property: string, readOnly?: boolean): void;

    /**
     * Lifecycle callback called when properties are enabled via
     * `_enableProperties`.
     *
     * Users may override this function to implement behavior that is
     * dependent on the element having its property data initialized, e.g.
     * from defaults (initialized from `constructor`, `_initializeProperties`),
     * `attributeChangedCallback`, or values propagated from host e.g. via
     * bindings.  `super.ready()` must be called to ensure the data system
     * becomes enabled.
     */
    ready(): void;

    /**
     * Initializes the local storage for property accessors.
     *
     * Provided as an override point for performing any setup work prior
     * to initializing the property accessor system.
     */
    _initializeProperties(): void;

    /**
     * Called at ready time with bag of instance properties that overwrote
     * accessors when the element upgraded.
     *
     * The default implementation sets these properties back into the
     * setter at ready time.  This method is provided as an override
     * point for customizing or providing more efficient initialization.
     *
     * @param props Bag of property values that were overwritten
     *   when creating property accessors.
     */
    _initializeInstanceProperties(props: object|null): void;

    /**
     * Updates the local storage for a property (via `_setPendingProperty`)
     * and enqueues a `_proeprtiesChanged` callback.
     *
     * @param property Name of the property
     * @param value Value to set
     */
    _setProperty(property: string, value: any): void;

    /**
     * Returns the value for the given property.
     *
     * @param property Name of property
     * @returns Value for the given property
     */
    _getProperty(property: string): any;

    /**
     * Updates the local storage for a property, records the previous value,
     * and adds it to the set of "pending changes" that will be passed to the
     * `_propertiesChanged` callback.  This method does not enqueue the
     * `_propertiesChanged` callback.
     *
     * @param property Name of the property
     * @param value Value to set
     * @param ext Not used here; affordance for closure
     * @returns Returns true if the property changed
     */
    _setPendingProperty(property: string, value: any, ext?: boolean): boolean;

    /**
     * Marks the properties as invalid, and enqueues an async
     * `_propertiesChanged` callback.
     */
    _invalidateProperties(): void;

    /**
     * Call to enable property accessor processing. Before this method is
     * called accessor values will be set but side effects are
     * queued. When called, any pending side effects occur immediately.
     * For elements, generally `connectedCallback` is a normal spot to do so.
     * It is safe to call this method multiple times as it only turns on
     * property accessors once.
     */
    _enableProperties(): void;

    /**
     * Calls the `_propertiesChanged` callback with the current set of
     * pending changes (and old values recorded when pending changes were
     * set), and resets the pending set of changes. Generally, this method
     * should not be called in user code.
     */
    _flushProperties(): void;

    /**
     * Called in `_flushProperties` to determine if `_propertiesChanged`
     * should be called. The default implementation returns true if
     * properties are pending. Override to customize when
     * `_propertiesChanged` is called.
     *
     * @param currentProps Bag of all current accessor values
     * @param changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param oldProps Bag of previous values for each property
     *   in `changedProps`
     * @returns true if changedProps is truthy
     */
    _shouldPropertiesChange(currentProps: object, changedProps: object, oldProps: object): boolean;

    /**
     * Callback called when any properties with accessors created via
     * `_createPropertyAccessor` have been set.
     *
     * @param currentProps Bag of all current accessor values
     * @param changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param oldProps Bag of previous values for each property
     *   in `changedProps`
     */
    _propertiesChanged(currentProps: object, changedProps: object, oldProps: object): void;

    /**
     * Method called to determine whether a property value should be
     * considered as a change and cause the `_propertiesChanged` callback
     * to be enqueued.
     *
     * The default implementation returns `true` if a strict equality
     * check fails. The method always returns false for `NaN`.
     *
     * Override this method to e.g. provide stricter checking for
     * Objects/Arrays when using immutable patterns.
     *
     * @param property Property name
     * @param value New property value
     * @param old Previous property value
     * @returns Whether the property should be considered a change
     *   and enqueue a `_proeprtiesChanged` callback
     */
    _shouldPropertyChange(property: string, value: any, old: any): boolean;

    /**
     * Implements native Custom Elements `attributeChangedCallback` to
     * set an attribute value to a property via `_attributeToProperty`.
     *
     * @param name Name of attribute that changed
     * @param old Old attribute value
     * @param value New attribute value
     */
    attributeChangedCallback(name: string, old: string|null, value: string|null): void;

    /**
     * Deserializes an attribute to its associated property.
     *
     * This method calls the `_deserializeValue` method to convert the string to
     * a typed value.
     *
     * @param attribute Name of attribute to deserialize.
     * @param value of the attribute.
     * @param type type to deserialize to, defaults to the value
     * returned from `typeForProperty`
     */
    _attributeToProperty(attribute: string, value: string|null, type?: any): void;

    /**
     * Serializes a property to its associated attribute.
     *
     * @param property Property name to reflect.
     * @param attribute Attribute name to reflect to.
     * @param value Property value to refect.
     */
    _propertyToAttribute(property: string, attribute?: string, value?: any): void;

    /**
     * Sets a typed value to an HTML attribute on a node.
     *
     * This method calls the `_serializeValue` method to convert the typed
     * value to a string.  If the `_serializeValue` method returns `undefined`,
     * the attribute will be removed (this is the default for boolean
     * type `false`).
     *
     * @param node Element to set attribute to.
     * @param value Value to serialize.
     * @param attribute Attribute name to serialize to.
     */
    _valueToNodeAttribute(node: Element|null, value: any, attribute: string): void;

    /**
     * Converts a typed JavaScript value to a string.
     *
     * This method is called when setting JS property values to
     * HTML attributes.  Users may override this method to provide
     * serialization for custom types.
     *
     * @param value Property value to serialize.
     * @returns String serialized from the provided
     * property  value.
     */
    _serializeValue(value: any): string|undefined;

    /**
     * Converts a string to a typed JavaScript value.
     *
     * This method is called when reading HTML attribute values to
     * JS properties.  Users may override this method to provide
     * deserialization for custom `type`s. Types for `Boolean`, `String`,
     * and `Number` convert attributes to the expected types.
     *
     * @param value Value to deserialize.
     * @param type Type to deserialize the string to.
     * @returns Typed value deserialized from the provided string.
     */
    _deserializeValue(value: string|null, type?: any): any;
  }
}

declare module '/local/community/mod/circle-sensor-card-depends/@polymer/polymer/lib/mixins/properties-mixin.js' {

  import {PropertiesChangedConstructor} from '/local/community/mod/circle-sensor-card-depends/@polymer/polymer/lib/mixins/properties-changed.js';
  export {PropertiesChangedConstructor} from '/local/community/mod/circle-sensor-card-depends/@polymer/polymer/lib/mixins/properties-changed.js';

  /**
   * Mixin that provides a minimal starting point to using the PropertiesChanged
   * mixin by providing a mechanism to declare properties in a static
   * getter (e.g. static get properties() { return { foo: String } }). Changes
   * are reported via the `_propertiesChanged` method.
   *
   * This mixin provides no specific support for rendering. Users are expected
   * to create a ShadowRoot and put content into it and update it in whatever
   * way makes sense. This can be done in reaction to properties changing by
   * implementing `_propertiesChanged`.
   */
  export function PropertiesMixin<T extends new (...args: any[]) => {}>(base: T): T & PropertiesMixinConstructor & PropertiesChangedConstructor;

  export interface PropertiesMixinConstructor {
    new(...args: any[]): PropertiesMixin;

    /**
     * Overrides `PropertiesChanged` method to return type specified in the
     * static `properties` object for the given property.
     *
     * @param name Name of property
     * @returns Type to which to deserialize attribute
     */
    typeForProperty(name: string): any;

    /**
     * Finalizes an element definition, including ensuring any super classes
     * are also finalized. This includes ensuring property
     * accessors exist on the element prototype. This method calls
     * `_finalizeClass` to finalize each constructor in the prototype chain.
     */
    finalize(): void;

    /**
     * Finalize an element class. This includes ensuring property
     * accessors exist on the element prototype. This method is called by
     * `finalize` and finalizes the class constructor.
     */
    _finalizeClass(): void;
  }

  export interface PropertiesMixin {

    /**
     * Overrides `PropertiesChanged` method and adds a call to
     * `finalize` which lazily configures the element's property accessors.
     */
    _initializeProperties(): void;

    /**
     * Called when the element is added to a document.
     * Calls `_enableProperties` to turn on property system from
     * `PropertiesChanged`.
     */
    connectedCallback(): void;

    /**
     * Called when the element is removed from a document
     */
    disconnectedCallback(): void;
  }
}

declare module '/local/community/mod/circle-sensor-card-depends/@polymer/polymer/lib/utils/case-map.js' {

  /**
   * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
   * (e.g. `fooBarBaz`).
   *
   * @returns Camel-case representation of the identifier
   */
  function dashToCamelCase(dash: string): string;

  /**
   * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
   * (e.g. `foo-bar-baz`).
   *
   * @returns Dash-case representation of the identifier
   */
  function camelToDashCase(camel: string): string;

}
