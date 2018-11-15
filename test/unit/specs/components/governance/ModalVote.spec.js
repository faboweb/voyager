"use strict"

import Vuelidate from "vuelidate"
import setup from "../../../helpers/vuex-setup"
import ModalVote from "renderer/components/governance/ModalVote"
import lcdClientMock from "renderer/connectors/lcdClientMock.js"

describe(`ModalVote`, () => {
  let wrapper
  let { mount, localVue } = setup()
  localVue.use(Vuelidate)

  beforeEach(() => {
    let instance = mount(ModalVote, {
      localVue,
      propsData: {
        proposalId: lcdClientMock.state.proposals[0].proposal_id,
        proposalTitle: lcdClientMock.state.proposals[0].title
      }
    })
    wrapper = instance.wrapper
    wrapper.update()
  })

  describe(`component matches snapshot`, () => {
    it(`has the expected html structure`, async () => {
      await wrapper.vm.$nextTick()
      wrapper.update()
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })

  describe(`default values are set correctly`, () => {
    it(`the 'option' defaults to an empty string`, () => {
      expect(wrapper.vm.option).toEqual(``)
    })
  })

  describe(`enables or disables Vote correctly`, () => {
    it(`disables the 'Vote' button`, () => {
      // default values
      let voteBtn = wrapper.find(`#cast-vote`)
      expect(voteBtn.html()).not.toContain(`active`)

      // non valid option value
      wrapper.setData({ option: `other` })
      expect(voteBtn.html()).not.toContain(`active`)
    })

    it(`enables the 'Vote' button if the user selected a valid option`, () => {
      wrapper.setData({ option: `yes` })
      let voteBtn = wrapper.find(`#vote-yes`)
      let submitButton = wrapper.find(`#cast-vote`)
      expect(voteBtn.html()).toContain(`active`)
      expect(submitButton.html()).not.toContain(`disabled="disabled"`)

      wrapper.setData({ option: `no` })
      voteBtn = wrapper.find(`#vote-no`)
      expect(voteBtn.html()).toContain(`active`)
      expect(submitButton.html()).not.toContain(`disabled="disabled"`)

      wrapper.setData({ option: `no_with_veto` })
      voteBtn = wrapper.find(`#vote-veto`)
      expect(voteBtn.html()).toContain(`active`)
      expect(submitButton.html()).not.toContain(`disabled="disabled"`)

      wrapper.setData({ option: `abstain` })
      voteBtn = wrapper.find(`#vote-abstain`)
      expect(voteBtn.html()).toContain(`active`)
      expect(submitButton.html()).not.toContain(`disabled="disabled"`)
    })
  })

  describe(`closes modal correctly`, () => {
    it(`X button emits close signal`, () => {
      wrapper.vm.close()

      expect(wrapper.emittedByOrder()).toEqual([
        {
          name: `update:showModalVote`,
          args: [false]
        }
      ])
    })
  })

  describe(`Vote`, () => {
    it(`updates the selected option on click`, () => {
      wrapper.vm.vote(`yes`)
      expect(wrapper.vm.option).toEqual(`yes`)

      wrapper.vm.vote(`no`)
      expect(wrapper.vm.option).toEqual(`no`)

      wrapper.vm.vote(`no_with_veto`)
      expect(wrapper.vm.option).toEqual(`no_with_veto`)

      wrapper.vm.vote(`abstain`)
      expect(wrapper.vm.option).toEqual(`abstain`)

      wrapper.vm.vote(`abstain`)
      expect(wrapper.vm.option).toEqual(``)
    })

    it(`Vote button casts a vote and closes modal`, () => {
      wrapper.setData({ option: `yes` })
      wrapper.vm.onVote()

      expect(wrapper.emittedByOrder()).toEqual([
        {
          name: `castVote`,
          args: [{ option: `yes` }]
        },
        {
          name: `update:showModalVote`,
          args: [false]
        }
      ])
    })
  })
})