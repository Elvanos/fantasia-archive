import { Notify } from 'quasar'
import { i18n } from 'app/src/i18n/externalFileLoader'

import { fantasiaImageList, determineCurrentImage } from 'app/src/scripts/appInfo/fantasiaMascotImageManager'
import { mdListArrayConvertor } from '../_utilities/mdListArrayConvertor'

export const tipsTricksTriviaNotification = (hideMascot: boolean) => {
  const messageList = mdListArrayConvertor(i18n.global.t('documents.tipsTricksTrivia'))

  const randomMessage = messageList[messageList.length * Math.random() << 0]

  Notify.create({
    timeout: 15000,
    icon: (hideMascot) ? 'mdi-help' : undefined,
    color: 'info',
    message: i18n.global.t('QuasarNotify.didYouKnow'),
    avatar: (!hideMascot) ? determineCurrentImage(fantasiaImageList, true, '') : undefined,
    caption: randomMessage,
    actions: [{ icon: 'mdi-close', color: 'white' }]
  })
}
