pc.extend(pc, function () {
    /**
     * @name pc.ImageComponentSystem
     * @description Create a new ImageComponentSystem
     * @class Attach 2D text to an entity
     * @param {pc.Application} app The application
     * @extends pc.ComponentSystem
     */

    var ImageComponentSystem = function ImageComponentSystem(app) {
        this.id = 'image';
        this.app = app;
        app.systems.add(this.id, this);

        this.ComponentType = pc.ImageComponent;
        this.DataType = pc.ImageComponentData;

        this.schema = [ 'enabled' ];

        this.material = null;
        this._shader = null;
        this.resolution = [1,1,1]; // canvas resolution
        this._defaultTexture = new pc.Texture(app.graphicsDevice, {width:4, height:4, format:pc.PIXELFORMAT_R8_G8_B8});

        this.defaultMaterial = new pc.StandardMaterial();
        this.defaultMaterial.emissiveMap = this._defaultTexture;
        this.defaultMaterial.opacityMap = this._defaultTexture;
        this.defaultMaterial.opacityMapChannel = "a";
        this.defaultMaterial.useLighting = false;
        this.defaultMaterial.blendType = pc.BLEND_PREMULTIPLIED;
        this.defaultMaterial.update();

        this.defaultScreenSpaceMaterial = new pc.StandardMaterial();
        this.defaultScreenSpaceMaterial.screenSpace = true;
        this.defaultScreenSpaceMaterial.emissiveMap = this._defaultTexture;
        this.defaultScreenSpaceMaterial.opacityMap = this._defaultTexture;
        this.defaultScreenSpaceMaterial.opacityMapChannel = "a";
        this.defaultScreenSpaceMaterial.useLighting = false;
        this.defaultScreenSpaceMaterial.blendType = pc.BLEND_PREMULTIPLIED;
        this.defaultScreenSpaceMaterial.update();

        // listen for adding and removing element components and pass this on to image components
        var elementSystem = app.systems.element;
        if (elementSystem) {
            elementSystem.on('add', this._onAddElement, this);
            elementSystem.on('remove', this._onRemoveElement, this);
        }

    };
    ImageComponentSystem = pc.inherits(ImageComponentSystem, pc.ComponentSystem);

    pc.extend(ImageComponentSystem.prototype, {
        initializeComponentData: function (component, data, properties) {
            if (data.materialAsset !== undefined) component.materialAsset = data.materialAsset;
            if (data.material !== undefined) component.material = data.material;
            if (data.textureAsset !== undefined) component.textureAsset = data.textureAsset;
            if (data.texture !== undefined) component.texture = data.texture;

            ImageComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        _onAddElement: function (entity, component) {
            if (entity.image) entity.image._onAddElement(component);
        },

        _onRemoveElement: function (entity) {
            if (entity.image) entity.image._onRemoveElement();
        }
    });

    return {
        ImageComponentSystem: ImageComponentSystem
    }
}());