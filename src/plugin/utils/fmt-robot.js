/**
 * 解析机器人消息回复
 * @param {object} msg 消息内容[云信结构]
 * @param {object} fmtContent 自定义消息内容[七鱼内部结构]
 * @return {array} 格式化后的消息
 */

export const fmtRobot = function (msg, content) {
  let ret = [];
  const { 
    answer_list,
    answer_label,
    answer_type,
    answer_flag,
    evaluation = 0,
    evaluation_content,
    evaluation_reason = 0,
    evaluation_guide = '感谢你的评价，请填写具体原因供我们改进',
    operator_hint = 0,
    operator_hint_desc,
  } = content;
  const list = JSON.parse(answer_list || 'null')||[];
  const len = list.length;

  // 答案 + 关联问题
  if (answer_label || len > 1) {
    // 区分相似问题 和 常见问题引导
    if (len > 0 && answer_type) {
      list.forEach(item => item.answer_type = answer_type);
    }

    ret.push({
      content: answer_label,
      list: list,
      type: 'qa-list',
      time: msg.time,
      fromUser: 0,
      answer_flag,
      evaluation,
      evalcontent: evaluation_content,
      evaluation_reason,
      evaluation_guide
    })
  
    // 仅答案
  } else if (len === 1) {
    ret.push({
      content: (list[0] || {}).answer || '',
      type: 'qa',
      time: msg.time,
      fromUser: 0,
      answer_flag,
      evaluation,
      evalcontent: evaluation_content,
      evaluation_reason,
      evaluation_guide
    })
  }

  // 是否显示附加提示
  if (operator_hint === 1) {
    ret.push({
      content: operator_hint_desc,
      type: [2, 3].includes(answer_flag) ? 'rich' : 'text',
      time: msg.time,
      fromUser: 0
    })
  }

  return ret;
}