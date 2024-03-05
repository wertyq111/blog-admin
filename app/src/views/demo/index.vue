<template>
  <div class="loading-overlay-showing" data-plugin-page-transition data-loading-overlay data-plugin-options="{'hideDelay': 500}">
    <div class="loading-overlay">
      <div class="bounce-loader">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>

    <div class="body">
      <header id="header" class="header-effect-shrink"
              data-plugin-options="{'stickyEnabled': true, 'stickyEffect': 'shrink', 'stickyEnableOnBoxed': true, 'stickyEnableOnMobile': true, 'stickyChangeLogo': true, 'stickyStartAt': 30, 'stickyHeaderContainerHeight': 70}">
        <div class="header-body">
          <div class="header-container container">
            <div class="header-row">
              <div class="header-column">
                <div class="header-row">
                  <div class="header-logo">
                    <a href="index.html">
                      <img alt="Porto" data-sticky-width="275" data-sticky-height="50" src="./images/logo1.png">
                    </a>
                  </div>
                </div>
              </div>
              <div class="header-column justify-content-end">
                <div class="header-row">
                  <div
                    class="header-nav header-nav-line header-nav-top-line header-nav-top-line-with-border order-2 order-lg-1">
                    <div
                      class="header-nav-main header-nav-main-square header-nav-main-effect-2 header-nav-main-sub-effect-1">
                      <nav class="collapse">
                        <ul class="nav nav-pills" id="mainNav">
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/" target="_top">
                              首页
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/base/supplier/supplierarchive"
                               target="_top">
                              供应商管理
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/base/customer/customerarchive"
                               target="_top">
                              客户管理
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/purchase/purchaseorder" target="_top">
                              采购管理
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/sale/saleorder" target="_top">
                              销售管理
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/inventory/reserve" target="_top">
                              库存管理
                            </a>
                          </li>
                          <li class="dropdown dropdown-mega">
                            <a class="dropdown-item dropdown-toggle" href="/purchase/invoice" target="_top">
                              发票管理
                            </a>
                          </li>
                          <!--                          <li class="dropdown dropdown-mega">-->
                          <!--                            <a class="dropdown-item dropdown-toggle" href="index.html">-->
                          <!--                              统计分析-->
                          <!--                            </a>-->
                          <!--                          </li>-->
                          <!--                          <li class="dropdown dropdown-mega">-->
                          <!--                            <a class="dropdown-item dropdown-toggle" href="index.html">-->
                          <!--                              行情服务-->
                          <!--                            </a>-->
                          <!--                          </li>-->
                          <!--                          <li class="dropdown dropdown-mega">-->
                          <!--                            <a class="dropdown-item dropdown-toggle" href="index.html">-->
                          <!--                              风险评级-->
                          <!--                            </a>-->
                          <!--                          </li>-->
                        </ul>
                      </nav>
                    </div>
                    <button class="btn header-btn-collapse-nav" data-toggle="collapse"
                            data-target=".header-nav-main nav">
                      <i class="fas iconfont icon-fenlei"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div role="main" class="main">
        <div class="container">
          <div class="main001">
            <div class="slogin_box1">
              <div class="slgtitle1">欢迎登录</div>
              <div class="stoinput1">
                <span class="icon iconfont icon-ren"></span>
                <input type="text">
              </div>
              <div class="stoinput1">
                <span class="icon iconfont icon-password"></span>
                <input type="password">
              </div>
              <div class="styzma1">
                <div class="sminput1"><span class="icon iconfont icon-biaozhu"></span><input type="text"
                                                                                             placeholder="请输入验证码">
                </div>
                <div class="stming1"><img src="./images/y.jpg" alt=""></div>
              </div>
              <div class="repaword1"><input type="checkbox" name="fm-agreement-checkbox"
                                            value="on"><label>记住密码</label></div>
              <div class="slgbtn1"><input type="button" value="登录"></div>
              <div class="slogin_tel1">咨询热线：0571-123456789</div>
            </div>
          </div>
        </div>

        <div class="owl-carousel-wrapper main007" style="height: 670px;">
          <div
            class="owl-carousel dots-inside dots-horizontal-center dots-light show-dots-hover nav-inside nav-inside-plus nav-dark nav-md nav-font-size-md show-nav-hover mb-0"
            data-plugin-options="{'responsive': {'0': {'items': 1}, '479': {'items': 1}, '768': {'items': 1}, '979': {'items': 1}, '1199': {'items': 1}}, 'loop': false, 'autoHeight': false, 'margin': 0, 'dots': true, 'dotsVerticalOffset': '-75px', 'nav': false, 'animateIn': 'fadeIn', 'animateOut': 'fadeOut', 'mouseDrag': false, 'touchDrag': false, 'pullDrag': false, 'autoplay': true, 'autoplayTimeout': 9000, 'autoplayHoverPause': true, 'rewind': true}">

            <!-- Carousel Slide 1 -->
            <div class="position-relative overlay overlay-color-primary overlay-show overlay-op-1"
                 data-dynamic-height="['670px','670px','670px','550px','500px']"
                 style="background-image: url(images/bg1.jpg); background-size: cover; background-position: center; height: 670px;">
              <div class="container position-relative z-index-3 h-100">
                <Div class="row justify-content-center align-items-center h-100">
                  <div class="col-lg-12">
                    <div class="d-flex flex-column align-items-left">
                      <h2 class="porto-big-title text-color-light font-weight-extra-bold mb-3 t07"
                          data-plugin-animated-letters
                          data-plugin-options="{'startDelay': 1000, 'minWindowWidth': 0, 'animationSpeed': 250, 'animationName': 'fadeInRightShorterOpacity', 'letterClass': 'd-inline-block'}">
                        网盛中小企业ERP云服务平台</h2>
                      <p class="text-4 text-color-light font-weight-light text-left mb-0 t07a"
                         data-plugin-animated-letters
                         data-plugin-options="{'startDelay': 2000, 'minWindowWidth': 0}">
                        基于云的现代企业ERP管理系统，可以满足各种业务需求。</p>
                      <p class="text-4 text-color-light font-weight-light text-left mb-0 t07b"
                         data-plugin-animated-letters
                         data-plugin-options="{'startDelay': 3000, 'minWindowWidth': 0}">
                        为企业打造生产全程一体化管理，助力企业降本增效。</p>
                    </div>
                  </div>
                </Div>
              </div>
            </div>

            <!-- Carousel Slide 2 -->
            <div class="position-relative overlay overlay-show overlay-op-8"
                 data-dynamic-height="['670px','670px','670px','550px','500px']"
                 style="background-image: url(images/bg2.jpg); background-size: cover; background-position: center; height: 670px;">
              <div class="container position-relative z-index-3 h-100">
                <Div class="row justify-content-center align-items-center h-100">
                  <div class="col-lg-12">
                    <div class="d-flex flex-column align-items-left">
                      <h2 class="text-color-light font-weight-extra-bold text-11 mb-4 t08 appear-animation"
                          data-appear-animation="blurIn" data-plugin-options="{'minWindowWidth': 0}">
                        网盛中小企业ERP云服务平台</h2>
                      <p class="text-5-5 text-color-light font-weight-light opacity-7 text-left mb-4 t08a"
                         data-plugin-animated-letters
                         data-plugin-options="{'startDelay': 1000, 'minWindowWidth': 0, 'animationSpeed': 25}">
                        融合了人工智能和云端新势能的新一代 ERP 云将成为企业战略、业务、管理革新和增长的强大引擎。</p>
                      <div class="m-no appear-animation" data-appear-animation="fadeInUpShorter"
                           data-appear-animation-delay="3300">
                        <div class="d-flex align-items-center mt-2">
                          <a href="#"
                             class="btn btn-light btn-modern text-color-primary font-weight-bold text-2 py-3 btn-px-4">联系我们</a>
                          <a href="#" class="btn btn-primary btn-modern font-weight-bold text-2 py-3 btn-px-4 ml-4">申请试用
                            <i class="fas fa-arrow-right ml-2"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Div>
              </div>
            </div>

          </div>
        </div>


        <div class="container py-5 mb-5 main005">
          <div class="row align-items-center pt-4 main005a appear-animation" data-appear-animation="fadeInLeftShorter">
            <div class="col-md-4 mb-4 mb-md-0 m-no">
              <img class="img-fluid scale-2 pr-5 pr-md-0 my-4" src="./images/intro.png" alt="layout styles"/>
            </div>
            <div class="col-md-8 pl-md-5">
              <h2 class="font-weight-normal text-6 mb-3 t01">网盛中小企业ERP云服务平台</h2>
              <p class="text-4">
                网盛中小企业ERP云服务平台助力中国中小企业数字化转型与发展，专为中小型企业设计，支持你全方位管理整个企业，包括财务、销售、客户关系和运营等领域。</p>
              <ul>
                <li class="text-4">面向成长型企业ERP平台</li>
                <li class="text-4">全程一体化管理，涵盖各业务模块</li>
                <li class="text-4">高度扩展，支持电脑手机多端使用</li>
              </ul>
            </div>
          </div>
          <div class="row counters counters-sm py-4 mt-5 main002a">
            <div class="col-sm-6 col-lg-4 mb-5 mb-lg-0">
              <div class="counter">
                <i class="icons iconfont icon-change text-color-dark"></i>
                <strong class="text-color-dark font-weight-extra-bold" data-to="30000" data-append="+">0</strong>
                <label class="text-4 mt-1">客户体验</label>
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 mb-5 mb-lg-0">
              <div class="counter">
                <i class="icons iconfont icon-canyupingji text-color-dark"></i>
                <strong class="text-color-dark font-weight-extra-bold" data-to="25">0</strong><span>年</span>
                <label class="text-4 mt-1">行业经验</label>
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 mb-5 mb-sm-0">
              <div class="counter">
                <i class="icons iconfont icon-zidingyi text-color-dark"></i>
                <strong class="text-color-dark font-weight-extra-bold" data-to="500" data-append="+">0</strong>
                <label class="text-4 mt-1">解决方案</label>
              </div>
            </div>
          </div>

        </div>


        <section class="section bg-color-grey-scale-1 section-height-3 border-0 m-0 main006">
          <div class="container">
            <div class="row">
              <div class="col">
                <h2 class="font-weight-normal text-center text-6 pb-3 t02">产品<strong
                  class="font-weight-extra-bold">功能</strong></h2>
              </div>
            </div>
            <div class="row mb-lg-4">
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInLeftShorter"
                   data-appear-animation-delay="300">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-a-1-case text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">控制财务运营</h4>
                    <p>网盛中小企业ERP云服务平台提供了一套完备的工具，旨在帮助你管理和简化财务运营。</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInUpShorter">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-a-6-ren text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">打造忠实客户群</h4>
                    <p>可以帮助你高效管理整个销售流程和客户生命周期，包括从首次接触客户到最终销售的各个环节。</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInRightShorter"
                   data-appear-animation-delay="300">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-a-8-calendar text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">优化购买和采购流程</h4>
                    <p>能够有效管理整个购买和采购流程，帮助你轻松对比不同的供应商和价格，从而发现节约成本的机会。</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInLeftShorter"
                   data-appear-animation-delay="300">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-a-2-toggles text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">实现库存控制</h4>
                    <p>能够提供有关库存的准确信息, 监控库存水平。你还可以实时更新库存，检查库存可用量，并管理定价。</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInUpShorter">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-huowu text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">借助统计分析，清晰洞察业务</h4>
                    <p>统计分析基于整个企业的数据，生成及时、准确的报表，并控制所显示信息的访问权限。</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 appear-animation" data-appear-animation="fadeInRightShorter"
                   data-appear-animation-delay="300">
                <div class="feature-box feature-box-style-2">
                  <div class="feature-box-icon">
                    <i class="icons iconfont icon-s4 text-color-primary"></i>
                  </div>
                  <div class="feature-box-info">
                    <h4 class="font-weight-bold mb-2">快速制定明智的决策</h4>
                    <p>能够捕捉销售、客户、运营和财务等领域的所有重要信息，从而支持更快速地制定明智的决策。</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <div class="main002">
          <div class="container">

            <div class="row text-center">
              <div class="col">
                <h2 class="font-weight-normal text-6 mt-5 t03">为什么选择<br class="pc-no"><strong
                  class="font-weight-extra-bold">网盛中小企业ERP云服务平台</strong></h2>
              </div>
            </div>

            <div class="image-gallery sort-destination full-width mb-0">
              <div class="isotope-item">
                <div class="image-gallery-item mb-0">
                  <a href="portfolio-single-wide-slider.html">
								<span class="thumb-info thumb-info-centered-info thumb-info-no-borders">
									<span class="thumb-info-wrapper">
										<img src="./images/p1.jpg" class="img-fluid" alt="">
										<span class="thumb-info-title">
											<span class="thumb-info-inner">生产一体化</span>
											<p>为企业打造生产全程一体化管理</p>
										</span>

									</span>
								</span>
                  </a>
                </div>
                <h5>生产一体化</h5>
              </div>
              <div class="isotope-item">
                <div class="image-gallery-item mb-0">
                  <a href="portfolio-single-wide-slider.html">
								<span class="thumb-info thumb-info-centered-info thumb-info-no-borders">
									<span class="thumb-info-wrapper">
										<img src="./images/p2.jpg" class="img-fluid" alt="">
										<span class="thumb-info-title">
											<span class="thumb-info-inner">高度扩展</span>
											<p>支持电脑手机多端使用</p>
										</span>

									</span>
								</span>
                  </a>
                </div>
                <h5>高度扩展</h5>
              </div>
              <div class="isotope-item">
                <div class="image-gallery-item mb-0">
                  <a href="portfolio-single-wide-slider.html">
								<span class="thumb-info thumb-info-centered-info thumb-info-no-borders">
									<span class="thumb-info-wrapper">
										<img src="./images/p3.jpg" class="img-fluid" alt="">
										<span class="thumb-info-title">
											<span class="thumb-info-inner">安全可靠</span>
											<p>全方位安全保障终身使用</p>
										</span>

									</span>
								</span>
                  </a>
                </div>
                <h5>安全可靠</h5>
              </div>
              <div class="isotope-item">
                <div class="image-gallery-item mb-0">
                  <a href="portfolio-single-wide-slider.html">
								<span class="thumb-info thumb-info-centered-info thumb-info-no-borders">
									<span class="thumb-info-wrapper">
										<img src="./images/p4.jpg" class="img-fluid" alt="">
										<span class="thumb-info-title">
											<span class="thumb-info-inner">高效服务</span>
											<p>服务团队一对一交流高效快捷</p>
										</span>

									</span>
								</span>
                  </a>
                </div>
                <h5>高效服务</h5>
              </div>
              <div class="isotope-item">
                <div class="image-gallery-item mb-0">
                  <a href="portfolio-single-wide-slider.html">
								<span class="thumb-info thumb-info-centered-info thumb-info-no-borders">
									<span class="thumb-info-wrapper">
										<img src="./images/p5.jpg" class="img-fluid" alt="">
										<span class="thumb-info-title">
											<span class="thumb-info-inner">可负担起</span>
											<p>快速设置和优化,易于使用</p>
										</span>

									</span>
								</span>
                  </a>
                </div>
                <h5>可负担起</h5>
              </div>
            </div>
          </div>
        </div>

        <section class="section section-background section-background-change-anim my-0 main003 appear-animation"
                 data-appear-animation="fadeIn">
          <div class="container">
            <div class="row py-5">
              <div class="col text-center">
                <div class="mb-5 appear-animation" data-appear-animation="fadeInUpShorter">
                  <h2 class="text-7 font-weight-normal text-color-light mb-2 t05">选择适合你的云ERP系统</h2>
                  <p class="text-4 text-color-light font-weight-light opacity-7 mb-0">
                    网盛中小企业ERP云服务平台帮助企业提升应变能力，走在行业前列。</p>
                </div>
                <div class="appear-animation" data-appear-animation="fadeInUpShorter" data-appear-animation-delay="400">
                  <a href="/login" target="_top"
                     class="btn btn-light btn-xl font-weight-bold text-color-dark py-3 text-2 t06">开启合作之旅 <i
                    class="fa fa-arrow-right iconfont icon-jiantou ml-2 pl-3 text-3"></i></a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <ul class="main008">
        <li><a href="#" class="main008a"><i class="iconfont icon-timsduihua"></i>在线咨询</a></li>
        <li><a href="#" class="main008b"><i class="iconfont icon-dianhua1"></i>电话联系</a></li>
      </ul>

      <footer id="footer" class="mt-0">
        <div class="container">

          <div class="row py-5 my-4">
            <div class="col-md-6 mb-4 mb-lg-0">
              <a href="index.html" class="logo pr-0 pr-lg-3">
                <img alt="Porto Website Template" src="./images/logo1-black.png" class="opacity-7 bottom-4" height="33">
              </a>
              <p class="mt-2 mb-2">
                网盛中小企业ERP云服务平台是一款成本可负担的量身定制型解决方案，专为中小型企业设计，支持全方位管理整个企业，包括财务、销售、客户关系和运营等领域，为企业打造生产全程一体化管理，助力企业降本增效。</p>
              <p class="mb-0"><a href="#" class="btn-flat btn-xs text-color-light"><strong
                class="text-2">开启合作之旅</strong><i
                class="fas fa-angle-right iconfont icon-jiantou_zuo-copy p-relative top-1 pl-2"></i></a></p>
            </div>
            <div class="col-md-6">
              <h5 class="text-3 mb-3">联系我们</h5>
              <div class="row">
                <div class="col-md-8">
                  <ul class="list list-icons list-icons-lg">
                    <li class="mb-1"><i class="far fa-dot-circle iconfont icon-dizhi text-color-primary"></i>
                      <p class="m-0">浙江省杭州市滨江区长河街道立业路788号网盛大厦29-35楼</p></li>
                    <li class="mb-1"><i class="fab fa-whatsapp iconfont icon-dianhua1 text-color-primary"></i>
                      <p class="m-0"><a href="tel:8001234567">86-571- 1234567</a></p></li>
                    <li class="mb-1"><i class="far fa-envelope iconfont icon-youxiang text-color-primary"></i>
                      <p class="m-0"><a href="mailto:mail@example.com">mail@example.com</a></p></li>
                  </ul>
                </div>
                <div class="col-md-4">
                  <ul class="list list-icons list-icons-sm">
                    <li><i class="fas fa-angle-right"></i><a href="#" class="link-hover-style-1 ml-1"> Tims在线客服<br>(周一至周五8:30-17:30)</a>
                    </li>
                    <li><i class="fas fa-angle-right"></i><a href="#" class="link-hover-style-1 ml-1"> 咨询专线: <br>86-571-
                      1234567</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-copyright footer-copyright-style-2">
          <div class="container py-2">
            <div class="row py-4">
              <div class="col d-flex align-items-center justify-content-center">
                <p> © 2023 网盛中小企业ERP云服务平台 版权所有</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
@import "./css/bootstrap.min.css";
@import "./css/animate.compat.css";
@import "./css/owl.carousel.min.css";
@import "./css/owl.theme.default.min.css";
@import "./css/theme.css";
@import "./css/theme-elements.css";
@import "./css/font1/iconfont.css";
@import "./css/base.css";
</style>
