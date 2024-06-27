
export const addMutilevelReplacer = (app, html) => {
    if(canvas.scene.drawings.filter(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.in") || foundry.utils.getProperty(x, "flags.multilevel-tokens.out")).length == 0) return

    if($(html).find('.multilevelReplacer').length > 0) return
    
    const button = $(`<button type="button" class="multilevelReplacer header-control fa-solid fa-skull" data-tooltip="REGIONENCHANTMENT.replaceMulti"></button>`)
    button.on("click", async(ev) => {
        ev.preventDefault()
        new MultiLevelReplacer().render(true)
    })

    $(html).find('.window-header').append(button)
}

class MultiLevelReplacer extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "MultiLevelReplacer",
        tag: "aside",
        position: {
          width: 320,
          height: "auto"
        },
        window: {
          title: "REGIONENCHANTMENT.replaceMulti",
          icon: "fa-regular fa-game-board",
          minimizable: false
        },
        actions: {},
      };

      static PARTS = {
        list: {
          id: "list",
          template: "modules/regionenchantment/templates/multilevel.hbs",
          scrollable: []
        }
      }

      async replaceToken(target) {
        console.log("replacing")
        const deleteSource = $(this.element).find('[name="deleteSource"]').is(":checked")
        const id = $(target).closest('.multiTokenHover')[0].dataset.id

        const drawing = canvas.scene.drawings.get(id)
        const teleporterId = drawing.flags["multilevel-tokens"].teleportId

        const connections = this.multilevels().filter(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.teleportId") == teleporterId)

        if(connections.length == 2) {
            const regions = await canvas.scene.createEmbeddedDocuments("Region", [this.prepareRegion(connections[0], teleporterId, "A"), this.prepareRegion(connections[1], teleporterId, "B")]);

            await this.buildBehavior(connections[0], regions[0], regions[1])
            await this.buildBehavior(connections[1], regions[1], regions[0])

            if(deleteSource) {
                await canvas.scene.deleteEmbeddedDocuments("Drawing", [connections[0].id, connections[1].id])
                this.render()
            }
        } else {
            const findScene = game.scenes.find(x => {
              return x.id != canvas.scene.id && this.multilevels(x).find(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.teleportId") == teleporterId)
            })

            if(findScene) {
              console.log(findScene)
              const regionA =  (await canvas.scene.createEmbeddedDocuments("Region", [this.prepareRegion(connections[0], teleporterId, "A")]))[0]
              const connectionB = this.multilevels(findScene).find(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.teleportId") == teleporterId)
              console.log(connectionB)
              const regionB =  (await findScene.createEmbeddedDocuments("Region", [this.prepareRegion(connectionB, teleporterId, "B")]))[0]
              console.log(regionA, regionB)

              await this.buildBehavior(connections[0], regionA, regionB)
              await this.buildBehavior(connectionB, regionB, regionA)

              if(deleteSource) {
                  await canvas.scene.deleteEmbeddedDocuments("Drawing", [connections[0].id])
                  await findScene.deleteEmbeddedDocuments("Drawing", [connectionB.id])
                  this.render()
              }

            } else {
              return ui.notifications.warn("Currently only Teleporters within the same scene can be replaced")
            }

            
        }
      }

      async buildBehavior(source, terminalA, terminalB) {
            if(source.flags["multilevel-tokens"].in) {
                await terminalA.createEmbeddedDocuments("RegionBehavior", [{type: "teleportToken", system: {destination: terminalB.uuid }}])
            }
      }

      prepareRegion(regA, teleporterId, prefix) {
            const multiTokenEntries = ["in", "out"].filter(x => regA.flags["multilevel-tokens"][x])

            const shapes = []
            if(regA.shape.type == "r") {
                shapes.push({
                    type: "rectangle",
                    width: regA.shape.width,
                    height: regA.shape.height,
                    x: regA.x,
                    y: regA.y
                })
            }

            return {
                name: `${teleporterId} - ${prefix} (${multiTokenEntries.join("/")})`,
                shapes
            }
      }

      _onRender(context, options) {
        super._onRender(context, options);
       
        $(this.element).find('.multiTokenHover').on('mouseenter', ev => {
            const drawing = canvas.scene.drawings.get(ev.currentTarget.dataset.id)
            const teleporterId = drawing.flags["multilevel-tokens"].teleportId

            const highlights = this.multilevels().filter(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.teleportId") == teleporterId)

            $(this.element).find('.multiTokenHover').removeClass('hovered')
            for(let highlight of highlights) {
                $(this.element).find(`[data-id="${highlight.id}"]`).addClass('hovered')
            }
        })
      }

      _onClickAction(event, target) {
          switch(target.dataset.action) {
              case "replace":
                  this.replaceToken(target)
                  break
              case "centerPlaceable":
                  this.centerPlaceable(target)
                  break
          }
      }

      centerPlaceable(target) {
        const id = $(target).closest('.multiTokenHover')[0].dataset.id
        const drawing = canvas.scene.drawings.get(id)

        canvas.animatePan({ x: drawing.x, y: drawing.y });
        drawing.object.control({ releaseOthers: true });
      }

      multilevels(scene = canvas.scene){
        return scene.drawings.filter(x => foundry.utils.getProperty(x, "flags.multilevel-tokens.in") || foundry.utils.getProperty(x, "flags.multilevel-tokens.out"))
      }

      async _prepareContext(_options) {
        const data = await super._prepareContext(_options)

        data.multiLevelTokens = this.multilevels().reduce((prev, cur) => {
            prev[cur.id] = cur.flags["multilevel-tokens"]
            return prev
        }, {})
        return data
      }
}